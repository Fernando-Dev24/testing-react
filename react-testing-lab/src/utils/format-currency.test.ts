import { describe, expect, it } from "vitest";
import { formatCurreny } from "./format-currency";

describe("Format currency function", () => {
  it("should throw when receive an infinity", () => {
    expect(() => formatCurreny(Infinity)).toThrow(
      "Currency amount has to be a finite number",
    );
  });

  it("should format currency correctly", () => {
    const formattedNumber = formatCurreny(10);
    expect(formattedNumber).toBe("$10.00");
  });
});
