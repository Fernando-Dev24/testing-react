export function calculateDiscount(price: number, discount: number) {
  if (price < 0) throw new Error("El precio debe ser positivo");
  if (discount < 0 || discount > 100)
    throw new Error(
      "El porcentaje de descuento no debe ser menor a cero o mayor a 100",
    );

  const decimalDiscount = discount / 100;
  return price - price * decimalDiscount;
}
