import { useState } from "react";

export type QuantitySelectorProps = {
  stock: number;
  onAddToCart: (quantity: number) => void;
};

export function QuantitySelector({
  stock,
  onAddToCart,
}: QuantitySelectorProps) {
  const [counter, setCounter] = useState(1);

  const increment = () => {
    setCounter((val) => Math.min(val + 1, stock));
  };

  const decrement = () => {
    setCounter((val) => Math.max(val - 1, 1));
  };

  return (
    <article>
      <div>
        <h2>Teclado mecánico</h2>
        <p>Unidades disponibles: {stock}</p>
      </div>

      <hr />

      <div>
        <label htmlFor="contador">Cantidad</label>
        <div>
          <button
            aria-label="Disminuir cantidad"
            disabled={counter <= 1}
            onClick={decrement}
          >
            -
          </button>

          <output htmlFor="contador" aria-label="Cantidad">
            {counter}
          </output>

          <button
            aria-label="Incrementar cantidad"
            disabled={counter >= stock}
            onClick={increment}
          >
            +
          </button>
        </div>

        {counter >= stock && <p>Has alcanzado el stock disponible</p>}
        <button onClick={() => onAddToCart(counter)}>Agregar al carrito</button>
      </div>
    </article>
  );
}
