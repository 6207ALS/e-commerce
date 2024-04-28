const dbQuery = require("./db-query");
const bcrypt = require("bcrypt");

module.exports = class PgPersistence {
  constructor(session) {
    this.username = session.username;
  }

  async authenticate(username, password) {
    const FIND_HASHED_PASSWORD = `
    SELECT password FROM users
    WHERE username = $1
    `;

    let results = await dbQuery(FIND_HASHED_PASSWORD, username);
    if (results.rowCount === 0) return false;

    return bcrypt.compare(password, results.rows[0].password);
  }

  async categoryExists(categoryName) {
    const SELECT_CATEGORY = `
    SELECT * FROM categories 
    WHERE title = $1
    `;

    let results = await dbQuery(SELECT_CATEGORY, categoryName);
    return results.rows.length > 0;
  }

  async createOrder(userId) {
    const CREATE_ORDER = `
    INSERT INTO orders (user_id)
    VALUES ($1)
    RETURNING id
    `;

    let results = await dbQuery(CREATE_ORDER, userId);
    
    return results.rows[0].id;
  }

  async itemExists(itemId) {
    const FIND_ITEM = `
    SELECT * FROM items
    WHERE id = $1
    `;

    let results = await dbQuery(FIND_ITEM, itemId);
    return results.rowCount === 1;
  }

  async loadCartItems(cart) {
    const FIND_ITEMS = `
    SELECT * FROM items
    WHERE id = ANY ($1)
    `;

    let results = await dbQuery(FIND_ITEMS, cart);
    return results.rows;
  }

  async loadCategories() {
    const SELECT_CATEGORIES = `
    SELECT title FROM categories
    `;

    let results = await dbQuery(SELECT_CATEGORIES);

    return results.rows;
  }

  async loadCategoryItems(category, pageNumber) {
    let offset = 9 * (pageNumber - 1); 

    const SELECT_ITEMS = `
    SELECT i.id, i.title, i.price FROM items i
    JOIN categories_items ci ON i.id = ci.item_id
    JOIN categories c ON c.id = ci.category_id
    WHERE c.title = $1
    ORDER BY i.title
    LIMIT 9
    OFFSET $2
    `;

    let results = await dbQuery(SELECT_ITEMS, category, offset);
    return results.rows;
  }

  async loadHistory(username) {
    const SELECT_ORDERS = `
    SELECT id, TO_CHAR(created, 'MM / DD / YYYY - HH24:MI:SS') AS created 
    FROM orders
    WHERE user_id = $1
    `;

    let userId = await this.userId(username);
    if (!userId) return undefined;

    let resultOrders = await dbQuery(SELECT_ORDERS, userId);
    return resultOrders.rows;
  }

  async loadOrderItems(orderId) {
    const FIND_ITEMS = `
    SELECT items.title,
    items.price,
    orders_items.quantity 
    FROM items
    JOIN orders_items ON items.id = orders_items.item_id
    WHERE order_id = $1;
    `;

    let resultItems = await dbQuery(FIND_ITEMS, orderId);
    return resultItems.rows;
  }

  async orderExists(orderId) {
    const FIND_ORDER = `
    SELECT * FROM orders
    WHERE id = $1
    `;

    let resultOrder = await dbQuery(FIND_ORDER, orderId);

    return resultOrder.rowCount === 1;
  }

  async pageCount(category) {
    const ROW_COUNT = `
    SELECT count(items.id) FROM items
    JOIN categories_items ON items.id = categories_items.item_id
    JOIN categories ON categories.id = categories_items.category_id
    WHERE categories.title = $1
    `;

    let results = await dbQuery(ROW_COUNT, category);
    let itemCount = results.rows[0].count;

    return Math.ceil(itemCount / 9);
  }

  async processOrder(cart, username) {
    let INSERT_ORDER_ITEM = `
    INSERT INTO orders_items (order_id, item_id, quantity)
    VALUES ($1, $2, $3) 
    `;

    let itemsIds = Object.keys(cart);
  
    let userId = await this.userId(username);
    if (!userId) return undefined;

    let orderId = await this.createOrder(userId);

    for (let itemId of itemsIds) {
      await dbQuery(INSERT_ORDER_ITEM, orderId, itemId, cart[itemId]);
    }

    return true;
  }

  async userId(username) {
    const FIND_USER_ID = `
    SELECT id FROM users
    WHERE username = $1
    `;

    let resultUserId = await dbQuery(FIND_USER_ID, username);
    if (resultUserId.rowCount !== 1) return undefined;

    return resultUserId.rows[0].id;
  }
}
