export class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    // Set the prototype explicitly to maintain the instanceof check
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
