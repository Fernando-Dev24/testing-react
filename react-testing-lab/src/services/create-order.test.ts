import { describe, expect, it, vi } from "vitest";
import { createOrder, type CreateOrderType } from "./create-order";

describe("Create Order", () => {
  const productId = "ABC1";

  const invalidOrderByProductId: [string, string][] = [
    ["", "Product ID is required"],
    ["  ", "Product ID is required"],
  ];

  const invalidOrderByQuantity: [number, string][] = [
    [0, "Quantity must be a positive integer"],
    [-2, "Quantity must be a positive integer"],
    [1.5, "Quantity must be a positive integer"],
  ];

  it("should create the order correctly", () => {
    const checkStock = vi.fn().mockReturnValue(true);
    const notify = vi.fn();

    const order = createOrder({ productId, quantity: 5 }, checkStock, notify);

    expect(order.status).toBe("created");
    expect(order).toStrictEqual({
      productId,
      quantity: 5,
      status: "created",
    });
  });

  it.each(invalidOrderByProductId)(
    "should validate productId: '%s'; and throw: '%s'",
    (productId, errorMsg) => {
      const order: CreateOrderType = {
        productId,
        quantity: 5,
      };

      const checkStock = vi.fn().mockReturnValue(true);
      const notify = vi.fn();

      expect(() => createOrder(order, checkStock, notify)).toThrow(errorMsg);
    },
  );

  it.each(invalidOrderByQuantity)(
    "should validate quantity: %i and throw: '%s'",
    (quantity, errorMsg) => {
      const order: CreateOrderType = {
        productId,
        quantity,
      };

      const checkStock = vi.fn().mockReturnValue(true);
      const notify = vi.fn();

      expect(() => createOrder(order, checkStock, notify)).toThrow(errorMsg);
    },
  );

  it("should throw 'Product out of stock'", () => {
    const order: CreateOrderType = {
      productId,
      quantity: 2,
    };

    const checkStock = vi.fn().mockReturnValue(false);
    const notify = vi.fn();

    expect(() => createOrder(order, checkStock, notify)).toThrow(
      "Product out of stock",
    );

    expect(checkStock).toHaveBeenCalledOnce();
    expect(checkStock).toHaveBeenCalledWith(productId);
    expect(notify).not.toHaveBeenCalled();
  });

  it("should called 'checkStock' with productId argument and execute once", () => {
    const checkStock = vi.fn().mockReturnValue(true);
    const notify = vi.fn();

    createOrder(
      {
        productId,
        quantity: 5,
      },
      checkStock,
      notify,
    );

    expect(checkStock).toHaveBeenCalledWith(productId);
    expect(checkStock).toHaveBeenCalledOnce();
  });

  it("should called 'notify' with message argument and execute once", () => {
    const checkStock = vi.fn().mockReturnValue(true);
    const notify = vi.fn();

    createOrder(
      {
        productId,
        quantity: 5,
      },
      checkStock,
      notify,
    );

    expect(notify).toHaveBeenCalledWith(`Order created for ${productId}`);
    expect(notify).toHaveBeenCalledOnce();
  });

  it("should not called notify and checkStock with an invalid productId or quantity", () => {
    const checkStock = vi.fn().mockReturnValue(true);
    const notify = vi.fn();

    expect(() =>
      createOrder({ productId: "", quantity: 5 }, checkStock, notify),
    ).toThrow("Product ID is required");

    expect(() =>
      createOrder({ productId, quantity: 0 }, checkStock, notify),
    ).toThrow("Quantity must be a positive integer");

    expect(checkStock).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();
  });
});
