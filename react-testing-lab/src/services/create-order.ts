type CheckStockFn = (productId: string) => boolean;
type NotificacionSender = (message: string) => void;

export type CreateOrderType = {
  productId: string;
  quantity: number;
};

const strBlanksRegex = /^\s+$/;

export function createOrder(
  data: CreateOrderType,
  checkStock: CheckStockFn,
  notify: NotificacionSender,
) {
  const { productId, quantity } = data;

  if (!productId || strBlanksRegex.test(productId)) {
    throw new Error("Product ID is required");
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error("Quantity must be a positive integer");
  }

  const inStock = checkStock(productId);

  if (!inStock) {
    throw new Error("Product out of stock.");
  }

  notify(`Order created for ${productId}`);

  return {
    productId,
    quantity,
    status: "created",
  };
}
