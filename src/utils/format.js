// 1160 -> "$1,160", 59.97000000001 -> "$59.97"
export function formatPrice(value) {
  const rounded = Math.round(Number(value) * 100) / 100;
  return "$" + rounded.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

// "2026-10-19T07:52:21Z" -> "Oct 19, 2026"
export function formatDate(iso) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// -> "7:52 AM"
export function formatTime(iso) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}
