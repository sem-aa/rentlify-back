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
exports.getProductByIdFromDB = exports.getProductsFromDB = void 0;
const sqlite_1 = require("sqlite");
const sqlite3_1 = __importDefault(require("sqlite3"));
const dbPromise = (0, sqlite_1.open)({
    filename: './database.sqlite',
    driver: sqlite3_1.default.Database,
});
const getProductsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield dbPromise;
    const { search, minPrice, maxPrice, category, location } = query;
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];
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
    const products = yield db.all(sql, ...params);
    return products;
});
exports.getProductsFromDB = getProductsFromDB;
const getProductByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield dbPromise;
    const product = yield db.get('SELECT * FROM products WHERE id = ?', id);
    return product;
});
exports.getProductByIdFromDB = getProductByIdFromDB;
