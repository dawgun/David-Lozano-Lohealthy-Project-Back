interface GameRequest<T> extends Express.Request {
  body: T;
}

export default GameRequest;
