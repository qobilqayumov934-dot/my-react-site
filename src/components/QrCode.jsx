// Декоративный "QR" — просто красивая заглушка, не настоящий код
export default function QrCode() {
  const size = 21;
  const cells = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const inFinder =
        (x < 7 && y < 7) || (x >= size - 7 && y < 7) || (x < 7 && y >= size - 7);
      let on;
      if (inFinder) {
        const lx = x < 7 ? x : x - (size - 7);
        const ly = y < 7 ? y : y - (size - 7);
        on =
          lx === 0 || lx === 6 || ly === 0 || ly === 6 ||
          (lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4);
      } else {
        on = (x * 7 + y * 13 + x * y) % 5 < 2;
      }
      if (on) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />);
    }
  }
  return (
    <svg className="qr" viewBox={`-1 -1 ${size + 2} ${size + 2}`} aria-hidden="true">
      <rect x="-1" y="-1" width={size + 2} height={size + 2} fill="#fff" />
      <g fill="#000">{cells}</g>
    </svg>
  );
}
