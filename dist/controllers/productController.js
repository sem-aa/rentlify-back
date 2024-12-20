"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductById = exports.getProducts = void 0;
const memory_cache_1 = __importDefault(require("memory-cache"));
const productModel_1 = require("../models/productModel");
const CustomError_1 = require("../utils/CustomError");
const CACHE_DURATION = 60 * 1000;
const getProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cacheKey = `products_${JSON.stringify(req.query)}`;
        const cachedResponse = memory_cache_1.default.get(cacheKey);
        if (cachedResponse) {
            res.json(cachedResponse);
            return;
        }
        const products = yield (0, productModel_1.getProductsFromDB)(req.query);
        memory_cache_1.default.put(cacheKey, products, CACHE_DURATION);
        res.json(products);
    }
    catch (error) {
        next(new CustomError_1.CustomError('Error fetching products', 500));
    }
});
exports.getProducts = getProducts;
const getProductById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cacheKey = `product_${req.params.id}`;
        const cachedResponse = memory_cache_1.default.get(cacheKey);
        if (cachedResponse) {
            res.json(cachedResponse);
            return;
        }
        const product = yield (0, productModel_1.getProductByIdFromDB)(req.params.id);
        if (product) {
            memory_cache_1.default.put(cacheKey, product, CACHE_DURATION);
            res.json(product);
        }
        else {
            res.status(404).json({ message: 'Product not found' });
        }
    }
    catch (error) {
        next(new CustomError_1.CustomError('Error fetching product', 500));
    }
});
exports.getProductById = getProductById;
