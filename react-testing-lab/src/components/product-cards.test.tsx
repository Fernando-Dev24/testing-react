import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProductCard } from "./product-card";

describe("Product Card render text correctly", () => {
  const name = "Teclado mecánico";
  const price = 59.99;
  const category = "Periféricos";
  const description = "Teclado mécanico con switches azules";

  const cases = [
    { inStock: true, expectedText: "Disponible" },
    { inStock: false, expectedText: "Agotado" },
  ];

  it("should render Product Card texts correctly", () => {
    render(
      <ProductCard
        name={"Teclado mecánico"}
        category="Periféricos"
        inStock={true}
        price={59.99}
      />,
    );

    const productCardContainer = screen.getByTestId("product-card-container");
    const heading = within(productCardContainer).getByRole("heading", {
      name,
      level: 2,
    });
    const price = within(productCardContainer).getByText("$59.99");
    const category = within(productCardContainer).getByText("Periféricos");

    expect(productCardContainer).toBeInTheDocument();
    expect(heading).toBeInTheDocument();
    expect(price).toBeInTheDocument();
    expect(category).toBeInTheDocument();
  });

  it.each(cases)(
    "should show '$expectedText' and correct button state for inStock: $inStock",
    (caseItem: { inStock: boolean; expectedText: string }) => {
      render(
        <ProductCard
          name={name}
          price={price}
          category={category}
          description={description}
          inStock={caseItem.inStock}
        />,
      );

      const availableText = screen.getByText(caseItem.expectedText);
      const triggerBtn = screen.getByRole("button", {
        name: "Agregar al carrito",
      });

      expect(availableText).toBeInTheDocument();

      if (caseItem.inStock) {
        expect(triggerBtn).toBeEnabled();
      } else {
        expect(triggerBtn).toBeDisabled();
      }
    },
  );
});
