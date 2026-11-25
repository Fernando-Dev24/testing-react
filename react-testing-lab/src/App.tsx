import "./App.css";
// import { ProductCard } from "./components/product-card";
// import { QuantitySelector } from "./components/quantity-selector";
import { RegisterForm } from "./components/register-form";

function App() {
  return (
    <>
      {/* <ProductCard
        name="Teclado mecánico"
        category="Periféricos"
        inStock={true}
        price={59.99}
      /> */}

      {/* <QuantitySelector stock={5} onAddToCart={() => {}} /> */}

      <RegisterForm onSubmit={(data) => console.log({ data })} />
    </>
  );
}

export default App;
