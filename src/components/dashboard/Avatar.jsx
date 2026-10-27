// Круглый аватар с инициалами; цвет зависит от имени
export default function Avatar({ name = "", size = 32 }) {
  const text = String(name);
  const words = text.replace(/[^\p{L}\s]/gu, " ").split(/\s+/).filter(Boolean);
  const initials = (
    (words[0]?.[0] ?? "?") + (words.length > 1 ? words[words.length - 1][0] : "")
  ).toUpperCase();

  let hue = 0;
  for (const ch of text) hue = (hue * 31 + ch.charCodeAt(0)) % 360;

  return (
    <span
      className="avatar"
      style={{ width: size, height: size, fontSize: size * 0.38, background: `hsl(${hue} 45% 42%)` }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}
