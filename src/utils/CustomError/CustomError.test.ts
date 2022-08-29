import CustomError from "./CustomError";

describe("Given the CustomError class", () => {
  const status = 200;

  describe("When it's instantiated with status 200", () => {
    test("Then should return an object with property with value 200", () => {
      const error = new CustomError(status, "", "");

      expect(error.statusCode).toBe(status);
    });
  });

  describe("When it's instantiated with private message 'No te toques'", () => {
    test("Then should return an object with property with value 'No te toques'", () => {
      const privateMessage = "No te toques";

      const error = new CustomError(status, privateMessage, "");

      expect(error.privateMessage).toBe(privateMessage);
    });
  });

  describe("When it's instantiated with public message 'Error en el sistema'", () => {
    test("Then should return an object with property with value 'Error en el sistema'", () => {
      const publicMessage = "Error en el sistema";

      const error = new CustomError(status, "", publicMessage);

      expect(error.publicMessage).toBe(publicMessage);
    });
  });
});
