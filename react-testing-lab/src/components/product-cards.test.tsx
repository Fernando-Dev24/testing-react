import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProductCard } from "./product-card";
import { formatCurreny } from "../utils/format-currency";

type CaseType = {
  name: string;
  category: string;
  price: number;
  inStock: boolean;
  description?: string;
  expectedText: string;
};

describe("Product Card render text correctly", () => {
  const cases = [
    {
      name: "Almohada grande",
      category: "Hogar",
      price: 30,
      inStock: true,
      expectedText: "Disponible",
      description: "Teclado mécanico con switches azules",
    },
    {
      name: "Impresora",
      category: "Oficina",
      price: 219.99,
      inStock: false,
      expectedText: "Agotado",
      description: undefined,
    },
    {
      name: "Libreta",
      category: "Estilo de vida",
      price: 15.99,
      inStock: false,
      expectedText: "Agotado",
      description: "",
    },
  ];

  it.each(cases)(
    "should render ProductCard correclty and show '$expectedText' and correct button state for inStock: $inStock",
    (caseItem: CaseType) => {
      render(
        <ProductCard
          name={caseItem.name}
          price={caseItem.price}
          category={caseItem.category}
          description={caseItem.description}
          inStock={caseItem.inStock}
        />,
      );

      const container = screen.getByRole("article");
      const formattedPrice = formatCurreny(caseItem.price);

      const header = within(container).getByRole("heading", {
        name: caseItem.name,
        level: 2,
      });
      const price = within(container).getByTestId("price");
      const category = within(container).getByText(caseItem.category);
      const availableText = within(container).getByText(caseItem.expectedText);
      const triggerBtn = within(container).getByRole("button", {
        name: "Agregar al carrito",
      });
      const descText = within(container).queryByTestId("product-description");

      if (caseItem.inStock) {
        expect(triggerBtn).toBeEnabled();
        expect(screen.queryByText("Agotado")).not.toBeInTheDocument();
      } else {
        expect(triggerBtn).toBeDisabled();
        expect(screen.queryByText("Disponible")).not.toBeInTheDocument();
      }

      if (caseItem.description) {
        expect(descText).toBeInTheDocument();
        expect(descText).toHaveTextContent(caseItem.description);
      } else {
        expect(descText).not.toBeInTheDocument();
      }

      expect(availableText).toBeInTheDocument();
      expect(header).toBeInTheDocument();
      expect(price).toBeInTheDocument();
      expect(price).toHaveTextContent(formattedPrice);
      expect(category).toBeInTheDocument();
    },
  );
});
