import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { QuantitySelector } from "./quantity-selector";

describe("Quantity selector", () => {
  const stocks = [1, 3, 5, 10];

  it.each(stocks)(
    "should validate initial state, then, increment to maximum: %i and then validate its state",
    async (stock) => {
      const user = userEvent.setup();
      let counter = 1;
      const onAddToCart = vi.fn();

      render(<QuantitySelector stock={stock} onAddToCart={onAddToCart} />);

      const container = screen.getByRole("article");

      const counterOutput = within(container).getByRole("status", {
        name: "Cantidad",
      });

      const decrementBtn = within(container).getByRole("button", {
        name: "Disminuir cantidad",
      });

      const incrementBtn = within(container).getByRole("button", {
        name: "Incrementar cantidad",
      });

      // RF-01. Comprobar que la cantidad inicial es 1
      expect(counterOutput).toHaveTextContent("1");

      // RF-06. El boton de disminuir se deshabilita cuando la cantidad es 1
      expect(decrementBtn).toBeDisabled();

      // RF-04. La cantidad nunca puede ser inferior a 1
      await user.click(decrementBtn);
      expect(counterOutput).toHaveTextContent("1");

      // Ciclo para llegar al maximo permitido en el contador
      while (counter < stock) {
        await user.click(incrementBtn);
        counter++;

        // RF-02. Incrementar aumenta la cantidad en una unidad
        expect(counterOutput).toHaveTextContent(String(counter));
      }

      // RF-05. La cantidad nunca puede ser mayor a stock
      expect(counterOutput).toHaveTextContent(stock.toString());

      // RF-04. El boton de incrementar se deshabilita cuando la cantidad es igual a stock
      expect(incrementBtn).toBeDisabled();

      // Presionar el boton de incrementar y validar que no se supera
      await user.click(incrementBtn);
      expect(counterOutput).not.toHaveTextContent(String(stock + 1));

      // RF-08. Al alcanzar el maximo, el mensaje de "Maximo alcanzado" deberia de aparecer
      expect(
        screen.getByText("Has alcanzado el stock disponible"),
      ).toBeInTheDocument();

      // RF-03. Disminuir reduce la cantidad en una unidad.
      if (counter > 1) {
        await user.click(decrementBtn);
        expect(counterOutput).toHaveTextContent(String(stock - 1));

        // RF-09. El mensaje de "Maximo alcanzado" desaparece cuando se disminuye del maximo de stock
        expect(
          screen.queryByText("Has alcanzado el stock disponible"),
        ).not.toBeInTheDocument();

        // Ahora que hay margen para aumentar o disminuir, ambos botones deberian estar habilitados
        expect(incrementBtn).toBeEnabled();
        expect(decrementBtn).toBeEnabled();
      }
    },
  );

  it("should handle a product with only one unit in stock", async () => {
    const user = userEvent.setup();
    const onAddToCart = vi.fn();

    render(<QuantitySelector stock={1} onAddToCart={onAddToCart} />);

    const container = screen.getByRole("article");

    const counterOuput = within(container).getByRole("status", {
      name: "Cantidad",
    });

    const decrementBtn = within(container).getByRole("button", {
      name: "Disminuir cantidad",
    });

    const incrementBtn = within(container).getByRole("button", {
      name: "Incrementar cantidad",
    });

    const maximumTxt = within(container).getByText(
      "Has alcanzado el stock disponible",
    );

    const addToCartBtn = within(container).getByRole("button", {
      name: "Agregar al carrito",
    });

    expect(counterOuput).toHaveTextContent("1");
    expect(incrementBtn).toBeDisabled();
    expect(decrementBtn).toBeDisabled();

    await user.click(incrementBtn);
    expect(counterOuput).toHaveTextContent("1");

    await user.click(decrementBtn);
    expect(counterOuput).toHaveTextContent("1");

    expect(maximumTxt).toBeInTheDocument();

    expect(addToCartBtn).toBeEnabled();

    expect(onAddToCart).not.toHaveBeenCalled();

    await user.click(addToCartBtn);

    expect(counterOuput).toHaveTextContent("1");

    expect(onAddToCart).toHaveBeenCalledWith(1);
    expect(onAddToCart).toHaveBeenCalledOnce();
  });

  it("should handle onAddToCart function correctly", async () => {
    const user = userEvent.setup();
    const onAddToCart = vi.fn();

    render(<QuantitySelector stock={3} onAddToCart={onAddToCart} />);

    const container = screen.getByRole("article");

    const counterOuput = within(container).getByRole("status", {
      name: "Cantidad",
    });

    const decrementBtn = within(container).getByRole("button", {
      name: "Disminuir cantidad",
    });

    const incrementBtn = within(container).getByRole("button", {
      name: "Incrementar cantidad",
    });

    const addToCartBtn = within(container).getByRole("button", {
      name: "Agregar al carrito",
    });

    // RF-10. Agregar al carrito ejecuta la funcion con la cantidad actual
    await user.click(incrementBtn);

    expect(counterOuput).toHaveTextContent("2");

    await user.click(addToCartBtn);

    expect(onAddToCart).toHaveBeenCalledOnce();
    expect(onAddToCart).toHaveBeenCalledWith(2);

    // RF-11. Agregar al carrito no modifica ni reinicia la cantidad
    expect(counterOuput).toHaveTextContent("2");
    expect(counterOuput).not.toHaveTextContent("1");

    // RF-12. Incrementar o disminuir no ejecuta onAddToCart
    await user.click(incrementBtn);
    expect(onAddToCart).not.toHaveBeenCalledTimes(2);

    await user.click(decrementBtn);
    expect(onAddToCart).not.toHaveBeenCalledTimes(2);
  });

  it("should navigate to increment button, trigger it, go back to decrement and change state to initial", async () => {
    const user = userEvent.setup();
    const onAddToCart = vi.fn();

    render(<QuantitySelector stock={3} onAddToCart={onAddToCart} />);

    const counterOutput = screen.getByRole("status", { name: "Cantidad" });
    const incrementBtn = screen.getByRole("button", {
      name: "Incrementar cantidad",
    });
    const decrementBtn = screen.getByRole("button", {
      name: "Disminuir cantidad",
    });

    await user.tab();
    expect(incrementBtn).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(counterOutput).toHaveTextContent("2");

    await user.tab({ shift: true });
    expect(decrementBtn).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(counterOutput).toHaveTextContent("1");
  });
});
