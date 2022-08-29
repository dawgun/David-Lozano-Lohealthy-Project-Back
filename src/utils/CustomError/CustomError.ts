interface ErrorWithCode {
  code: string;
}

class CustomError extends Error implements ErrorWithCode {
  code: string;

  constructor(
    public statusCode: number,
    public privateMessage: string,
    public publicMessage: string
  ) {
    super(privateMessage);
  }
}

export default CustomError;
