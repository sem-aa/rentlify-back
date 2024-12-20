"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const compression_1 = __importDefault(require("compression"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const errorHandler_1 = require("./middlewares/errorHandler");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, compression_1.default)());
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use('/products', productRoutes_1.default);
app.use(errorHandler_1.errorHandler);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
