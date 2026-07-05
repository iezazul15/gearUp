class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly errors: string[] = [],
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
