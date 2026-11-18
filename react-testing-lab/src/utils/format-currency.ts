export function formatCurreny(curr: number) {
  if (!Number.isFinite(curr)) {
    throw new Error("Currency amount has to be a finite number");
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 2,
  }).format(curr);
}
