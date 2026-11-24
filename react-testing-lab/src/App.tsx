import "./App.css";
import { QuantitySelector } from "./components/quantity-selector";

function App() {
  return (
    <>
      {/* <ProductCard
        name="Teclado mecánico"
        category="Periféricos"
        inStock={true}
        price={59.99}
      /> */}

      <QuantitySelector stock={5} onAddToCart={() => {}} />
    </>
  );
}

export default App;
