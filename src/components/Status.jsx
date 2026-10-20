// Показывает "загрузка" или "ошибка"; когда всё ок — ничего не рисует
export default function Status({ status }) {
  if (status === "loading") return <p className="status">Loading…</p>;
  if (status === "error") {
    return (
      <p className="status status--error">
        Could not load products. Check your connection and refresh the page.
      </p>
    );
  }
  return null;
}
