import { describe, expect, it } from "vitest";
import { applyCoupon, type Coupon } from "./coupon-engine";

describe("Validate purchase validation", () => {
  const coupons = [
    // Validar el total
    {
      total: Infinity,
      coupon: {
        active: true,
        code: "ABC1",
        minPurchase: 10,
        type: "fixed",
        value: 50,
      },
      expected: "Invalid purchase total",
    },
    {
      total: -10,
      coupon: {
        active: true,
        code: "ABC1",
        minPurchase: 10,
        type: "fixed",
        value: 50,
      },
      expected: "Invalid purchase total",
    },

    // Validar el coupon
    {
      total: 50,
      coupon: {
        code: "", // cupon invalido
        value: 50,
        minPurchase: 10,
        type: "fixed",
        active: true,
      },
      expected: "Invalid coupon",
    },
    {
      total: 50,
      coupon: {
        code: "\t", // cupon invalido
        value: 50,
        minPurchase: 10,
        type: "fixed",
        active: true,
      },
      expected: "Invalid coupon",
    },
    {
      total: 50,
      coupon: {
        code: "ABC1",
        value: Infinity, // value infinito
        minPurchase: 10,
        type: "fixed",
        active: true,
      },
      expected: "Invalid coupon",
    },
    {
      total: 50,
      coupon: {
        code: "ABC1",
        value: 0, // value menor o igual que cero
        minPurchase: 10,
        type: "fixed",
        active: true,
      },
      expected: "Invalid coupon",
    },
    {
      total: 50,
      coupon: {
        code: "ABC1",
        value: -1, // value menor o igual que cero
        minPurchase: 10,
        type: "fixed",
        active: true,
      },
      expected: "Invalid coupon",
    },
    {
      total: 50,
      coupon: {
        code: "ABC1",
        value: 10,
        minPurchase: Infinity, // minPurchase infinito
        type: "fixed",
        active: true,
      },
      expected: "Invalid coupon",
    },
    {
      total: 50,
      coupon: {
        code: "ABC1",
        value: 0,
        minPurchase: -1, // minPurchase menor que cero
        type: "fixed",
        active: true,
      },
      expected: "Invalid coupon",
    },
    {
      total: 50,
      coupon: {
        code: "ABC1",
        value: 50,
        minPurchase: 10,
        type: "", // validar que type sea valido en sus dos tipos: percentage o fixed
        active: true,
      },
      expected: "Invalid coupon",
    },
    {
      total: 50,
      coupon: {
        code: "ABC1",
        value: 0,
        minPurchase: 10,
        type: "ABC", // validar que type sea valido en sus dos tipos: percentage o fixed
        active: true,
      },
      expected: "Invalid coupon",
    },
    {
      total: 50,
      coupon: {
        code: "ABC1",
        value: 0,
        minPurchase: 10,
        type: "fixed",
        active: -1, // validar que active sea un booleano explicitamente y no admita valores falsy o truthy
      },
      expected: "Invalid coupon",
    },
    {
      total: 50,
      coupon: {
        code: "ABC1",
        value: 0,
        minPurchase: 10,
        type: "fixed",
        active: 10, // validar que active sea un booleano explicitamente y no admita valores falsy o truthy
      },
      expected: "Invalid coupon",
    },
  ];

  it.each(coupons)(
    `should throw error when $total is Infinite or less than zero`,
    (coupon) => {
      expect(() => applyCoupon(coupon.total, coupon.coupon as Coupon)).toThrow(
        coupon.expected,
      );
    },
  );

  it.each(coupons)(
    "should throw $expected when coupon is invalid on any of these key fields code, value, minPurchase, type, active",
    (coupon) => {
      expect(() => applyCoupon(coupon.total, coupon.coupon as Coupon)).toThrow(
        coupon.expected,
      );
    },
  );

  it("should throw error when active key is false", () => {
    const coupon: Coupon = {
      code: "ABC1",
      value: 20,
      minPurchase: 10,
      type: "percentage",
      active: false,
    };

    expect(() => applyCoupon(50, coupon)).toThrow("Coupon is inactive");
  });

  it("should throw error when total not reached minPurchase value", () => {
    const coupon: Coupon = {
      code: "ABC1",
      value: 20,
      minPurchase: 30,
      type: "percentage",
      active: true,
    };

    expect(() => applyCoupon(29, coupon)).toThrow(
      "Minium purchase not reached",
    );
    expect(() => applyCoupon(30, coupon)).not.toThrow(
      "Minium purchase not reached",
    );
  });
});
