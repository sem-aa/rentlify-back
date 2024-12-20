import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';

const initDb = async () => {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      name TEXT,
      price REAL,
      category TEXT,
      location TEXT,
      description TEXT,
      image TEXT
    );
  `);

  const dataPath = path.resolve(__dirname, '../../data.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  const insertProduct = await db.prepare(`
    INSERT INTO products (id, name, price, category, location, description, image)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const product of data) {
    await insertProduct.run(
      product.id,
      product.name,
      product.price,
      product.category,
      product.location,
      product.description,
      product.image,
    );
  }

  await insertProduct.finalize();
  console.log('Database initialized');
};

initDb().catch((err) => {
  console.error('Error initializing database:', err);
});
