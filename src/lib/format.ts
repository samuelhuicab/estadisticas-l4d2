export function formatNumber(value: number): string {
  return Number.isInteger(value)
    ? value.toLocaleString("es-MX")
    : value.toLocaleString("es-MX", { maximumFractionDigits: 2 });
}
