import { describe, expect, it } from "vitest";
import { calculateBalance } from "./calculate-balance";

describe("calculateBalance", () => {
  it("should substract an expense from balanca", () => {
    const result = calculateBalance(100, 30);

    expect(result).toBe(70);
  });
});
