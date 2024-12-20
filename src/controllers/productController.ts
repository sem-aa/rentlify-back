import { Request, Response, NextFunction } from 'express';
import cache from 'memory-cache';
import {
  getProductsFromDB,
  getProductByIdFromDB,
} from '../models/productModel';
import { CustomError } from '../utils/CustomError';

const CACHE_DURATION = 60 * 1000;

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const cacheKey = `products_${JSON.stringify(req.query)}`;
    const cachedResponse = cache.get(cacheKey);

    if (cachedResponse) {
      res.json(cachedResponse);
      return;
    }

    const products = await getProductsFromDB(req.query);

    cache.put(cacheKey, products, CACHE_DURATION);
    res.json(products);
  } catch (error) {
    next(new CustomError('Error fetching products', 500));
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const cacheKey = `product_${req.params.id}`;
    const cachedResponse = cache.get(cacheKey);

    if (cachedResponse) {
      res.json(cachedResponse);
      return;
    }
    const product = await getProductByIdFromDB(req.params.id);
    if (product) {
      cache.put(cacheKey, product, CACHE_DURATION);
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    next(new CustomError('Error fetching product', 500));
  }
};
