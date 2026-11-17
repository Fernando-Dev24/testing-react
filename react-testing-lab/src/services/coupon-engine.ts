import { strBlanksRegex } from "./create-order";

export type Coupon = {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minPurchase: number;
  active: boolean;
};

export type CouponResult = {
  originalTotal: number;
  discount: number;
  finalTotal: number;
};

const allowedCouponTypes = ["percentage", "fixed"];

function purchaseValidation(total: number) {
  if (!Number.isFinite(total) || total < 0)
    throw new Error("Invalid purchase total");
}

function couponValidation(coupon: Coupon) {
  const { code, value, minPurchase, type, active } = coupon;

  if (!code || strBlanksRegex.test(code)) {
    throw new Error("Invalid coupon");
  }

  if (!Number.isFinite(value) || value <= 0) {
    throw new Error("Invalid coupon");
  }

  if (!Number.isFinite(minPurchase) || minPurchase < 0) {
    throw new Error("Invalid coupon");
  }

  if (!type || !allowedCouponTypes.includes(type)) {
    throw new Error("Invalid coupon");
  }

  if (typeof active !== "boolean") {
    throw new Error("Invalid coupon");
  }

  // Validar cuando el cupon sea de porcentage que el valor no sea mayor a 100
  if (type === "percentage" && value > 100) {
    throw new Error("Invalid coupon");
  }
}

function isCouponInactive(active: boolean) {
  if (!active) {
    throw new Error("Coupon is inactive");
  }
}

function validateMinPurchase(total: number, minPurchase: number) {
  if (total < minPurchase) {
    throw new Error("Minimum purchase not reached");
  }
}

export function applyCoupon(total: number, coupon: Coupon): CouponResult {
  purchaseValidation(total);
  couponValidation(coupon);
  isCouponInactive(coupon.active);
  validateMinPurchase(total, coupon.minPurchase);

  let discount: number = Math.min(total, coupon.value);

  if (coupon.type === "percentage") {
    discount = total * (coupon.value / 100);
  }

  return {
    originalTotal: total,
    discount,
    finalTotal: total - discount,
  };
}
