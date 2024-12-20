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
const sqlite_1 = require("sqlite");
const sqlite3_1 = __importDefault(require("sqlite3"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const initDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield (0, sqlite_1.open)({
        filename: './database.sqlite',
        driver: sqlite3_1.default.Database,
    });
    yield db.exec(`
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
    const dataPath = path_1.default.resolve(__dirname, '../../data.json');
    const data = JSON.parse(fs_1.default.readFileSync(dataPath, 'utf-8'));
    const insertProduct = yield db.prepare(`
    INSERT INTO products (id, name, price, category, location, description, image)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
    for (const product of data) {
        yield insertProduct.run(product.id, product.name, product.price, product.category, product.location, product.description, product.image);
    }
    yield insertProduct.finalize();
    console.log('Database initialized');
});
initDb().catch((err) => {
    console.error('Error initializing database:', err);
});
