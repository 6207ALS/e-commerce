const config = require("./lib/config");
const catchError = require("./lib/catch-error");
const express = require("express");
const flash = require("express-flash");
const morgan = require("morgan");
const session = require("express-session");
const store = require("connect-loki");
const { body, validationResult } = require("express-validator");
const PgPersistence = require("./lib/pg-persistence");

const PORT = config.PORT;
const HOST = config.HOST;
const app = express();
const LokiStore = store(session);

app.set("views", "./views");
app.set("view engine", "pug");

app.use(flash());
app.use(morgan("common"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(session({
  cookie: {
    httpOnly: true,
    maxAge: 31 * 24 * 60 * 60 * 1000, // 31 days in millseconds
    path: "/",
    secure: false,
  },
  name: "e-commerce-session-id",
  resave: false,
  saveUninitialized: true,
  secret: config.SECRET,
  store: new LokiStore({}),
}));

// Create a new data store
app.use((req, res, next) => {
  res.locals.store = new PgPersistence(req.session);
  next();
});

// Create a new cart if it doesn't exist.
// A cart is an object whose properties are the item IDs
// and their values represent the quantity.
app.use((req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = {};
  }

  next();
});

// Extract session info
app.use((req, res, next) => {
  res.locals.cart = req.session.cart;
  res.locals.username = req.session.username;
  res.locals.signedIn = req.session.signedIn;
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});

// Detect unauthorized access to routes
const requiresAuthentication = (req, res, next) => {
  if (!req.session.signedIn) {
    req.flash("Info", "Please sign in.");
    res.redirect("/signin");
  } else {
    next();
  }
};

// Convert array of items into array of subarrays of items.
const formatToRows = (items, rowLength) => {
  let itemsRows = [];

  while (items.length > rowLength) {
    let row = [];
    for (let i = 0; i < rowLength; i++) {
      row.push(items.shift());
    }
    itemsRows.push(row);
  }

  itemsRows.push(items);
  return itemsRows;
};

// Redirect to start page.
app.get("/", (req, res) => {
  requiresAuthentication,
  res.redirect("/categories");
});

// Render Sign in page
app.get("/signin", (req, res) => {
  res.render("signin");
});

// Validate user's "sign in" crendentials.
app.post("/signin",
  [
    body("username")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Username is required.")
      .isLength({ max: 100 })
      .withMessage("Username is too long."),
    body("password")
      .isLength({ min: 1 })
      .withMessage("Password is required.")
      .isLength({ max: 100 })
      .withMessage("Username is too long."),
  ],
  catchError(async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      errors.array().forEach(err => req.flash("error", err.msg));
      res.render("signin", {
        flash: req.flash(),
      });
    } else {
      let valid = await res.locals.store.authenticate(username, password);
      if (!valid) {
        req.flash("error", "Invalid Crendentials")
        res.render("signin", {
          flash: req.flash(),
        });
      } else {
        req.session.username = username;
        req.session.signedIn = true;
        req.flash("success", "Signed In");
        res.redirect("/categories");
      }
    }    
  })
);

// Render homepage
app.get("/categories", 
  requiresAuthentication,
  catchError(async (req, res) => {
    let categories = await res.locals.store.loadCategories();
    res.render("categories", { categories });
  })
);

// Display Category Items
app.get("/categories/:categoryName/:pageNumber", 
  catchError(async (req, res) => {
    const ROW_LENGTH = 3;
    let categoryName = req.params.categoryName;
    let pageNumber = +req.params.pageNumber;
    let categoryExists = await res.locals.store.categoryExists(categoryName);

    if (!categoryExists) throw new Error("Not found.");

    // Promises to retrieve required view variables
    let resultItems = res.locals.store.loadCategoryItems(categoryName, pageNumber);
    let resultPageCount = res.locals.store.pageCount(categoryName);
    let resultBoth = await Promise.all([resultItems, resultPageCount]);

    let [items, pageCount] = [resultBoth[0], resultBoth[1]];
    items = formatToRows(items, ROW_LENGTH);

    res.render("category-items", { 
      items, 
      pageCount,
      pageNumber,
      categoryName
    });
  })
);

// Render user's cart of items
app.get("/cart",
  catchError(async (req, res) => {
    let cart = req.session.cart;
    let cartItemsIds = Object.keys(cart).map(itemId => +itemId);

    let cartItems = await res.locals.store.loadCartItems(cartItemsIds);
    let cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

    res.render("cart", {
      cartItems,
      cart,
      cartTotal,
    });
  })
);

// Render checkout page
app.get("/checkout", 
  catchError(async (req, res) => {
    let cart = req.session.cart;
    let cartItemsIds = Object.keys(cart).map(itemId => +itemId);

    let cartItems = await res.locals.store.loadCartItems(cartItemsIds);
    let cartTotal = Math.round(cartItems.reduce((sum, item) => {
      return sum + (+item.price * cart[item.id]);
    }, 0) * 100) / 100;


    res.render("checkout", {
      cartItems,
      cart,
      cartTotal
    })
  })
);

// Render user's history of orders
app.get("/history",
  catchError(async (req, res) => {
    let username = res.locals.username;

    let orders = await res.locals.store.loadHistory(username);
    if (!orders) throw new Error("Not found.");

    res.render("history", { orders });
  })
)

// Render an individual order's items
app.get("/history/:orderId", 
  catchError(async (req, res) => {
    let orderId = req.params.orderId;
    let orderExists = res.locals.store.orderExists(orderId);
    if (!orderExists) throw new Error("Not found.");

    let orderItems = await res.locals.store.loadOrderItems(orderId);
    let orderTotal = orderItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    console.log(orderItems);

    res.render("order-items", { 
      orderItems,
      orderTotal
    });
  })
);

// Add selected item to user's cart
app.post("/cart",
  catchError(async (req, res) => {
    let itemId = +req.body.itemId;
    let itemQuantity = +req.body.itemQuantity
    let itemExists = res.locals.store.itemExists(itemId);

    if (!itemExists) throw new Error("Not found.");
    
    req.session.cart[itemId] = itemQuantity;
    req.flash("success", "Item added to cart!");
    res.redirect("/categories");
  })
);

// Delete selected item from user's cart
app.post("/delete",
  catchError(async (req, res) => {
    let itemId = +req.body.itemId;
    let itemExists = res.locals.store.itemExists(itemId);

    if (!itemExists) throw new Error("Not found.");
    
    delete req.session.cart[itemId];
    req.flash("success", "Item removed from cart!");
    res.redirect("/categories");
  })
);

// Checkout and process user's order
app.post("/checkout", 
  catchError(async (req, res) => {
    let cart = req.session.cart;
    let username = res.locals.username;

    let processOrder = await res.locals.store.processOrder(cart, username);
    if (!processOrder) throw new Error("Not found.");

    delete req.session.cart;
    req.flash("success", "Order has been placed!");
    res.redirect("/categories");
  })
);

app.post("/signout", (req, res) => {
  delete req.session.username;
  delete req.session.signedIn;

  req.flash("success", "Signed out.");
  res.redirect("/signin");
});


// Error handler
app.use((err, req, res, _next) => {
  console.log(err);
  res.status(404).send(err.message);
});

// Listener
app.listen(PORT, HOST, () => {
  console.log(`Listening to port ${PORT} on ${HOST}...`);
});
