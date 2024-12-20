import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

const dbPromise = open({
  filename: './database.sqlite',
  driver: sqlite3.Database,
});

export const getProductsFromDB = async (query: any) => {
  const db = await dbPromise;
  const { search, minPrice, maxPrice, category, location } = query;

  let sql = 'SELECT * FROM products WHERE 1=1';
  const params: any[] = [];

  if (search) {
    sql += ' AND (name LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  if (minPrice) {
    const minPriceNumber = parseFloat(minPrice);
    if (!isNaN(minPriceNumber)) {
      sql += ' AND price >= ?';
      params.push(minPriceNumber);
    }
  }

  if (maxPrice) {
    const maxPriceNumber = parseFloat(maxPrice);
    if (!isNaN(maxPriceNumber)) {
      sql += ' AND price <= ?';
      params.push(maxPriceNumber);
    }
  }

  if (category) {
    sql += ' AND category = ?';
    params.push(category);
  }

  if (location) {
    sql += ' AND location = ?';
    params.push(location);
  }

  const products = await db.all(sql, ...params);
  return products;
};

export const getProductByIdFromDB = async (id: string) => {
  const db = await dbPromise;
  const product = await db.get('SELECT * FROM products WHERE id = ?', id);
  return product;
};
