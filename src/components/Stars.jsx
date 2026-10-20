function StarShape() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

// value может быть дробным: 4.5 → четыре с половиной звезды
export default function Stars({ value = 0 }) {
  return (
    <span className="stars" role="img" aria-label={`Rating ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const fill = Math.max(0, Math.min(1, value - (n - 1))); // 0 … 1
        return (
          <span key={n} className="star">
            <StarShape />
            <span className="star__fill" style={{ width: `${fill * 100}%` }}>
              <StarShape />
            </span>
          </span>
        );
      })}
    </span>
  );
}
