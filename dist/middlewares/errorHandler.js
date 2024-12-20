"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const CustomError_1 = require("../utils/CustomError");
const errorHandler = (err, req, res, next) => {
    console.error(`Error occurred in ${req.method} ${req.url}:`, err.stack);
    if (!(res instanceof Response)) {
        console.error('res is not an instance of Response');
        return next(err);
    }
    if (err instanceof CustomError_1.CustomError) {
        res.status(err.statusCode).json({
            message: err.message,
        });
    }
    else {
        res.status(500).json({
            message: 'Internal Server Error',
            error: err.message,
        });
    }
};
exports.errorHandler = errorHandler;
