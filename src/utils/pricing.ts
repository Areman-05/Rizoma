export function formatPrice(value: number, currency = "EUR") {
  return `${value.toFixed(2)} ${currency}`;
}

export function salePercent(price: number, originalPrice?: number) {
  if (!originalPrice || originalPrice <= price) return undefined;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}
