// Заголовок страницы панели и кнопки справа (как «...» и «Add» в макете)
export default function PageHeader({ title, children }) {
  return (
    <div className="dash__head">
      <h1 className="dash__title">{title}</h1>
      {children && <div className="dash__actions">{children}</div>}
    </div>
  );
}
