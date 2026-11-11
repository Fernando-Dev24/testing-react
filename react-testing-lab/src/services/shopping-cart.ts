export type CartItem = {
  id: string;
  price: number;
  quantity: number;
};

const idRegex = /^\S+$/;

export class ShoppingCart {
  private items: CartItem[] = [];

  addItem(incomingItem: CartItem) {
    const { price, quantity, id } = incomingItem;

    if (!Number.isFinite(price) || price < 0) {
      throw new Error("Product price needs to be finite and positive");
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error("Product quantity need to be positive and integer");
    }

    if (!id || !idRegex.test(id)) {
      throw new Error("Product Id does not have to be empty or contain spaces");
    }

    const existingItem = this.items.find((item) => item.id === id);

    if (existingItem) {
      existingItem.quantity += incomingItem.quantity;
      return;
    }

    this.items.push({ ...incomingItem });
  }

  removeItem(itemId: string) {
    this.items = this.items.filter((item) => item.id !== itemId);
  }

  getItems() {
    return this.items.map((item) => ({ ...item }));
  }

  getTotal(): number {
    if (this.items.length < 1) return 0;

    return this.items.reduce(
      // eslint-disable-next-line no-useless-assignment
      (acc, curr) => (acc += curr.quantity * curr.price),
      0,
    );
  }

  clear() {
    this.items = [];
  }
}
