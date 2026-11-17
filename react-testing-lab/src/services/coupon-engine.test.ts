import { describe, expect, it } from "vitest";
import { applyCoupon, type Coupon } from "./coupon-engine";

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
        minPurchase: 10,
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
        minPurchase: 10,
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
        minPurchase: 10,
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
        minPurchase: 30,
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

describe("Validate percentage coupons", () => {
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
