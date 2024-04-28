CREATE TABLE users (
  id serial PRIMARY KEY,
  username text NOT NULL UNIQUE,
  password text NOT NULL
);

CREATE TABLE orders (
  id serial PRIMARY KEY,
  user_id integer REFERENCES users (id) ON DELETE CASCADE,
  created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE items (
  id serial PRIMARY KEY,
  title text NOT NULL UNIQUE,
  price decimal(6, 2) NOT NULL,
);

CREATE TABLE categories (
  id serial PRIMARY KEY,
  title text UNIQUE
);

CREATE TABLE orders_items (
  id serial PRIMARY KEY,
  order_id integer NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  item_id integer NOT NULL REFERENCES items (id) ON DELETE CASCADE,
  quantity integer NOT NULL
);

CREATE TABLE categories_items (
  id serial PRIMARY KEY,
  category_id integer NOT NULL REFERENCES categories (id) ON DELETE CASCADE,
  item_id integer NOT NULL REFERENCES items (id) ON DELETE CASCADE
);