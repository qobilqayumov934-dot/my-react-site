// 1160 -> "$1,160", 59.97000000001 -> "$59.97"
export function formatPrice(value) {
  const rounded = Math.round(Number(value) * 100) / 100;
  return "$" + rounded.toLocaleString("en-US", { maximumFractionDigits: 2 });
}
