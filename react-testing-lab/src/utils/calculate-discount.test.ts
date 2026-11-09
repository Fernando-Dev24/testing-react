import { describe, expect, it } from "vitest";
import { calculateDiscount } from "./calculate-discount";

describe("Discount function", () => {
  it("should calculate total price with a discount", () => {
    const price = 100;
    const discount = 20;

    const result = calculateDiscount(price, discount);

    expect(result).toBe(80);
  });

  it("should return price with zero discount", () => {
    const price = 100;
    const discount = 0;

    const result = calculateDiscount(price, discount);

    expect(result).toBe(100);
  });

  it("should return zero with 100% discount", () => {
    const price = 100;
    const discount = 100;

    const result = calculateDiscount(price, discount);

    expect(result).toBe(0);
  });

  it("should throw an exception when price is negative", () => {
    const price = -10;
    const discount = 20;

    expect(() => calculateDiscount(price, discount)).toThrow();
    expect(() => calculateDiscount(price, discount)).toThrow(
      "El precio debe ser positivo",
    );
  });

  it("should throw an exception when discount is less than zero", () => {
    const price = 100;
    const discount = -5;

    expect(() => calculateDiscount(price, discount)).toThrow();
    expect(() => calculateDiscount(price, discount)).toThrow(
      "El porcentaje de descuento no debe ser menor a cero o mayor a 100",
    );
  });

  it("should throw an exception when discount exceeds 100", () => {
    const price = 100;
    const discount = 120;

    expect(() => calculateDiscount(price, discount)).toThrow();
    expect(() => calculateDiscount(price, discount)).toThrow(
      "El porcentaje de descuento no debe ser menor a cero o mayor a 100",
    );
  });
});
