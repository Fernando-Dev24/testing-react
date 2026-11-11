import { beforeEach, describe, expect, it } from "vitest";
import { ShoppingCart, type CartItem } from "./shopping-cart";

describe("Shopping Cart - manage items and state", () => {
  let cart: ShoppingCart;

  beforeEach(() => {
    cart = new ShoppingCart();
  });

  it("should recently created cart be empty", () => {
    expect(cart.getItems()).toHaveLength(0);
  });

  it("should add a valid item", () => {
    const item: CartItem = {
      id: "ABC1",
      price: 50.0,
      quantity: 1,
    };

    cart.addItem(item);

    // toEqual = buscara que el carrito tenga un producto
    // toContain = busca el item comparando que tengan el mismo puntero de memoria
    // toContainEqual = busca que tenga el objeto con las mismas key-values sin importar el puntero de memoria

    expect(cart.getItems()).toEqual([item]); // asi evaluo que solo tenga este unico objeto
    expect(cart.getItems()).toContainEqual(item);
  });

  it("should add two different products", () => {
    const product1: CartItem = { id: "cd39d938", price: 12, quantity: 1 };
    const product2: CartItem = { id: "fe90d39c9044", price: 24, quantity: 2 };

    cart.addItem(product1);
    cart.addItem(product2);

    expect(cart.getItems()).toContainEqual(product1);
    expect(cart.getItems()).toContainEqual(product2);
    expect(cart.getItems()).toEqual([product1, product2]);
  });

  it("should increment quantity when adding same product", () => {
    const product: CartItem = { id: "ABC1", price: 59.99, quantity: 5 };

    cart.addItem(product);
    cart.addItem(product);

    expect(cart.getItems()).toContainEqual({ ...product, quantity: 10 });
  });

  it("should remove an existing product", () => {
    const product1: CartItem = { id: "ABC1", price: 24, quantity: 3 };
    const product2: CartItem = { id: "DEF", price: 48, quantity: 1 };

    cart.addItem(product1);
    cart.addItem(product2);
    cart.removeItem(product1.id);

    expect(cart.getItems()).not.toContainEqual(product1);
    expect(cart.getItems()).toEqual([product2]);
  });

  it("should remove a product that does not exists", () => {
    const productTest: CartItem = { id: "ABC1", price: 79.99, quantity: 1 };

    cart.addItem(productTest);
    cart.removeItem("PRODUCT_ID");

    expect(() => cart.removeItem("PRODUCT_ID_2")).not.toThrow();
    expect(cart.getItems()).toContainEqual(productTest);
    expect(cart.getItems()).toEqual([productTest]);
  });

  it("should return zero when cart is empty", () => {
    expect(cart.getItems()).toHaveLength(0);
    expect(cart.getTotal()).toBe(0);
  });

  it("should return the total when are items on cart", () => {
    const product1: CartItem = { id: "123", price: 29.99, quantity: 1 };
    const product2: CartItem = { id: "456", price: 59.99, quantity: 2 };

    cart.addItem(product1);
    cart.addItem(product2);

    expect(cart.getItems()).toEqual([product1, product2]);
    expect(cart.getTotal()).toBeCloseTo(149.97);
  });

  it("should clear cart", () => {
    const product1: CartItem = { id: "123", price: 29.99, quantity: 1 };
    const product2: CartItem = { id: "456", price: 59.99, quantity: 2 };

    cart.addItem(product1);
    cart.addItem(product2);
    cart.clear();

    expect(cart.getItems()).not.toEqual([product1, product2]);
    expect(cart.getItems()).toHaveLength(0);
  });

  it("should do not change internal state of shopping cart when get items", () => {
    const product: CartItem = { id: "ABC1", price: 19.99, quantity: 8 };
    const invalidProduct: CartItem = {
      id: "Hola\t",
      price: -1,
      quantity: Infinity,
    };

    cart.addItem(product);

    const externalItems = cart.getItems();
    externalItems.push(invalidProduct);
    externalItems[0].quantity = 0;

    expect(cart.getItems()).toHaveLength(1);
    expect(cart.getItems()).toContainEqual(product);
    expect(cart.getItems()).not.toContainEqual(invalidProduct);
  });

  it("should do not change products list when receive an invalid entry product", () => {
    const invalidProduct: CartItem = {
      id: "Hola\t",
      price: -1,
      quantity: Infinity,
    };

    expect(() => cart.addItem(invalidProduct)).toThrow(); // todas las entries deberian de lanzar un throw
    expect(cart.getItems()).toHaveLength(0);
    expect(cart.getItems()).not.toContainEqual(invalidProduct);
  });

  it("should not update a product after adding it", () => {
    const item: CartItem = {
      id: "ABC1",
      price: 50.0,
      quantity: 1,
    };

    cart.addItem(item);
    item.quantity = 100;

    expect(cart.getItems()).not.toContainEqual({ ...item, quantity: 100 });
    expect(cart.getItems()).toContainEqual({ ...item, quantity: 1 });
  });
});

describe("Shopping cart - invalid entries", () => {
  let cart: ShoppingCart;

  beforeEach(() => {
    cart = new ShoppingCart();
  });

  const invalidIdMsg = "Product Id does not have to be empty or contain spaces";
  const invalidPriceMsg = "Product price needs to be finite and positive";
  const invalidQuantityMsg = "Product quantity need to be positive and integer";

  const invalidIds: [string, string][] = [
    ["", invalidIdMsg], // id vacio
    ["  ", invalidIdMsg], // id con espacios
    ["AB\tc", invalidIdMsg], // id con tabulaciones
  ];

  const invalidPrices: [number, string][] = [
    [Infinity, invalidPriceMsg], // valor infinite
    [-1, invalidPriceMsg], // valor negativo entero
    [-0.5, invalidPriceMsg], // valor negativo decimal
  ];

  const invalidQuantities: [number, string][] = [
    [1.5, invalidQuantityMsg], // valor decimal
    [0, invalidQuantityMsg], // valor cero
    [-1, invalidQuantityMsg], // valor negativo
  ];

  it.each(invalidIds)(
    "should throw cause %s is an invalid entry",
    (id, errorMsg) => {
      expect(() => cart.addItem({ id, price: 10, quantity: 5 })).toThrow(
        errorMsg,
      );
    },
  );

  it.each(invalidPrices)(
    "should throw cause price %i is an invalid entry",
    (price, errorMsg) => {
      expect(() => cart.addItem({ id: "ABC1", price, quantity: 5 })).toThrow(
        errorMsg,
      );
    },
  );

  it.each(invalidQuantities)(
    "should throw cause quantity %i is an invalid entry",
    (quantity, errorMsg) => {
      expect(() => cart.addItem({ id: "ABC1", price: 5, quantity })).toThrow(
        errorMsg,
      );
    },
  );
});
