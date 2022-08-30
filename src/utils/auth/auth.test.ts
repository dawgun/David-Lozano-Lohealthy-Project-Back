import bcrypt from "bcryptjs";
import hashCreator from "./auth";

describe("Given the hashCreator function", () => {
  describe("When it's called with patatasfritas", () => {
    test("Then it should return 'patatasfritashasheadas'", async () => {
      bcrypt.hash = jest.fn().mockResolvedValue("patatasfritashasheadas");
      const expectedTextHashed = "patatasfritashasheadas";

      const textHashed = await hashCreator("patatasfritas");

      expect(textHashed).toBe(expectedTextHashed);
    });
  });
});
