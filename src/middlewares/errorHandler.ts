import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/CustomError';

export const errorHandler = (
  err: Error | CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(`Error occurred in ${req.method} ${req.url}:`, err.stack);

  if (!(res instanceof Response)) {
    console.error('res is not an instance of Response');
    return next(err);
  }

  if (err instanceof CustomError) {
    res.status(err.statusCode).json({
      message: err.message,
    });
  } else {
    res.status(500).json({
      message: 'Internal Server Error',
      error: err.message,
    });
  }
};
