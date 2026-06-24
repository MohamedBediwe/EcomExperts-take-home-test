import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(__dirname, '..', 'test.db')
const db = new Database(dbPath)

db.exec(`
  CREATE TABLE IF NOT EXISTS steps (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    aliasName TEXT NOT NULL,
    icon TEXT NOT NULL,
    order_num INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    badge_text TEXT,
    badge_color TEXT,
    has_variants INTEGER DEFAULT 0,
    price REAL NOT NULL,
    compare_at_price REAL,
    category TEXT NOT NULL,
    step_id INTEGER NOT NULL,
    FOREIGN KEY (step_id) REFERENCES steps(id)
  );

  CREATE TABLE IF NOT EXISTS variants (
    id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    label TEXT NOT NULL,
    swatch TEXT NOT NULL,
    price REAL,
    PRIMARY KEY (id, product_id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );
`)

export default db