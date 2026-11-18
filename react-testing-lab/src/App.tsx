import "./App.css";
import { ProductCard } from "./components/product-card";

function App() {
  return (
    <>
      <ProductCard
        name="Teclado mecánico"
        category="Periféricos"
        inStock={true}
        price={59.99}
      />
    </>
  );
}

export default App;
