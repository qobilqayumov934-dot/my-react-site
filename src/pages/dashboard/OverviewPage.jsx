import { useOutletContext } from "react-router-dom";
import { Icon } from "../../components/Icon";
import PageHeader from "../../components/dashboard/PageHeader";
import UsersTable from "../../components/dashboard/UsersTable";
import { formatPrice } from "../../utils/format";

export default function OverviewPage() {
  const { products, productsStatus, users, usersStatus, orders } = useOutletContext();

  // Выручка — по всем заказам, кроме отменённых
  const revenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const stats = [
    { label: "Products", value: productsStatus === "success" ? products.length : "…", icon: "box" },
    { label: "Users", value: usersStatus === "success" ? users.length : "…", icon: "users" },
    { label: "Orders", value: orders.length, icon: "file" },
    { label: "Revenue", value: formatPrice(revenue), icon: "cart" },
  ];

  const latestUsers = [...users]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <>
      <PageHeader title="Overview" />

      <div className="stats">
        {stats.map((s) => (
          <div key={s.label} className="stat">
            <span className="stat__icon"><Icon name={s.icon} size={20} /></span>
            <div>
              <div className="stat__label">{s.label}</div>
              <div className="stat__value">{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="dash__subtitle">Latest users</h2>
      <UsersTable users={latestUsers} status={usersStatus} />
    </>
  );
}
