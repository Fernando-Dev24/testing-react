import { formatCurreny } from "../utils/format-currency";

export type ProductCardProps = {
  name: string;
  category: string;
  price: number;
  inStock: boolean;
  description?: string;
};

export const ProductCard = (props: ProductCardProps) => {
  return (
    <article data-testid="product-card-container">
      <div>
        <h2>{props.name}</h2>
        <p>{props.category}</p>
        {props.description && (
          <p data-testid="product-description">{props.description}</p>
        )}
      </div>

      <div>
        <p data-testid="price">{formatCurreny(props.price)}</p>
        <p>{props.inStock ? "Disponible" : "Agotado"}</p>
      </div>

      <button disabled={!props.inStock}>Agregar al carrito</button>
    </article>
  );
};
