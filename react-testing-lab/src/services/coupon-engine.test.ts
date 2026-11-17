import { describe, expect, it } from "vitest";
import { applyCoupon, type Coupon, type CouponResult } from "./coupon-engine";

type CouponEachType = {
  total: number;
  coupon: Coupon;
  expected: string;
};

describe("Validate purchase validation", () => {
  const coupons: CouponEachType[] = [
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
        minPurchase: -30,
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
        minPurchase: 60,
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
        minPurchase: 60,
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
        minPurchase: 60,
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
        minPurchase: 60,
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
        minPurchase: 60,
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
        minPurchase: 60,
        type: "\t" as "percentage" | "fixed", // validar que type sea valido en sus dos tipos: percentage o fixed
        active: true,
      },
      expected: "Invalid coupon",
    },
    {
      total: 50,
      coupon: {
        code: "ABC1",
        value: 0,
        minPurchase: 60,
        type: "ABC" as "percentage" | "fixed", // validar que type sea valido en sus dos tipos: percentage o fixed
        active: true,
      },
      expected: "Invalid coupon",
    },
    {
      total: 50,
      coupon: {
        code: "ABC1",
        value: 0,
        minPurchase: 60,
        type: "fixed",
        active: -1 as unknown as boolean, // validar que active sea un booleano explicitamente y no admita valores falsy o truthy
      },
      expected: "Invalid coupon",
    },
    {
      total: 50,
      coupon: {
        code: "ABC1",
        value: 0,
        minPurchase: 60,
        type: "fixed",
        active: 10 as unknown as boolean, // validar que active sea un booleano explicitamente y no admita valores falsy o truthy
      },
      expected: "Invalid coupon",
    },

    // Validar que el cupon no pase si es de tipo porcentaje y su valor es mayor a 100, el cual equivale al porcentaje a descontar
    {
      total: 50,
      coupon: {
        code: "ABC1",
        value: 101,
        minPurchase: 60,
        type: "percentage",
        active: true,
      },
      expected: "Invalid coupon",
    },
  ];

  it.each(coupons)(
    `should throw $expected when $total or $coupon key values are incorrect`,
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
      minPurchase: 100,
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
      "Minimum purchase not reached",
    );
    expect(() => applyCoupon(30, coupon)).not.toThrow();
  });
});

describe("Calculate percentage coupons", () => {
  const tests = [
    {
      total: 10,
      coupon: {
        value: 10,
        active: true,
        code: "TEN_COUPON_DISCOUNT",
        minPurchase: 10,
        type: "percentage",
      } as Coupon,
      expected: { discount: 1, originalTotal: 10, finalTotal: 9 },
    },
    {
      total: 10,
      coupon: {
        value: 100,
        active: true,
        code: "TEN_COUPON_DISCOUNT",
        minPurchase: 10,
        type: "percentage",
      } as Coupon,
      expected: { discount: 10, originalTotal: 10, finalTotal: 0 },
    },
  ];

  it.each(tests)(
    "should apply $expected.discount% discount on $coupon",
    (testItem) => {
      const resp = applyCoupon(testItem.total, testItem.coupon);

      expect(resp.originalTotal).toBe(testItem.total);
      expect(resp.discount).toBeCloseTo(testItem.expected.discount);
      expect(resp.finalTotal).toBeCloseTo(testItem.expected.finalTotal);

      expect(resp).toEqual(testItem.expected);
    },
  );
});

describe("Calculate fixed coupons", () => {
  it("should apply when discount is less than total purchase", () => {
    const total = 50;
    const coupon: Coupon = {
      code: "COUPON_CODE",
      active: true,
      minPurchase: 20,
      type: "fixed",
      value: 30,
    };

    const resp = applyCoupon(total, coupon);
    const expectedResp: CouponResult = {
      discount: 30,
      originalTotal: total,
      finalTotal: 20,
    };

    expect(resp.originalTotal).toBe(total);
    expect(resp.discount).toBeCloseTo(30);
    expect(resp.finalTotal).toBeCloseTo(20);

    expect(resp).toEqual(expectedResp);
  });

  it("should limit discount when total is less than discount value", () => {
    const total = 30;
    const coupon: Coupon = {
      code: "COUPON_CODE",
      active: true,
      minPurchase: 20,
      type: "fixed",
      value: 50,
    };

    const resp = applyCoupon(total, coupon);
    const expectedResp: CouponResult = {
      discount: 30,
      originalTotal: total,
      finalTotal: 0,
    };

    expect(resp.originalTotal).toBe(total);
    expect(resp.discount).toBeCloseTo(30);
    expect(resp.finalTotal).toBeCloseTo(0);

    expect(resp).toEqual(expectedResp);
  });

  it("should complete purchase when total is zero", () => {
    const coupon: Coupon = {
      code: "COUPON_CODE",
      active: true,
      minPurchase: 0,
      type: "fixed",
      value: 50,
    };

    const couponPercentage: Coupon = {
      code: "COUPON_CODE",
      active: true,
      minPurchase: 0,
      type: "percentage",
      value: 50,
    };

    const respFixed = applyCoupon(0, coupon);
    const respPer = applyCoupon(0, couponPercentage);

    expect(respFixed.originalTotal).toBeCloseTo(0);
    expect(respFixed.discount).toBeCloseTo(0);
    expect(respFixed.finalTotal).toBeCloseTo(0);

    expect(respPer.originalTotal).toBeCloseTo(0);
    expect(respPer.discount).toBeCloseTo(0);
    expect(respPer.finalTotal).toBeCloseTo(0);
  });

  it("should calculate correctly the purchase discount with floats", () => {
    const coupon: Coupon = {
      code: "COUPON_CODE",
      active: true,
      minPurchase: 9.99,
      type: "fixed",
      value: 5,
    };

    const resp = applyCoupon(29.99, coupon);
    const expectedResp: CouponResult = {
      discount: 5,
      originalTotal: 29.99,
      finalTotal: 24.99,
    };

    expect(resp.discount).toBeCloseTo(5);
    expect(resp.originalTotal).toBeCloseTo(29.99);
    expect(resp.finalTotal).toBeCloseTo(24.99);

    expect(resp).toStrictEqual(expectedResp);
  });
});
