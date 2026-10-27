import { useOutletContext } from "react-router-dom";
import { Icon } from "../../components/Icon";
import Avatar from "../../components/dashboard/Avatar";
import PageHeader from "../../components/dashboard/PageHeader";
import { formatDate, formatPrice, formatTime } from "../../utils/format";

const STATUS_LABELS = { new: "New", done: "Done", cancelled: "Cancelled" };

export default function OrdersPage() {
  const { orders, onOrderCycle, onOrderDelete, onOrdersClear } = useOutletContext();

  const handleDelete = (order) => {
    if (window.confirm(`Delete order #${order.id}?`)) onOrderDelete(order.id);
  };

  const handleClear = () => {
    if (window.confirm("Delete all orders?")) onOrdersClear();
  };

  return (
    <>
      <PageHeader title="Orders">
        {orders.length > 0 && (
          <button type="button" className="dash-btn" onClick={handleClear}>Clear all</button>
        )}
      </PageHeader>

      <div className="dash-card">
        <h2 className="dash-card__title">All orders</h2>

        {orders.length === 0 ? (
          <p className="dash__status">No orders yet. Orders placed from the cart will appear here.</p>
        ) : (
          <div className="dash-scroll">
            <table className="dash-table dash-table--list">
              <thead>
                <tr>
                  <th>Order details</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th><span className="visually-hidden">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => {
                  const first = o.items[0]?.name ?? "";
                  const more = o.items.length > 1 ? ` +${o.items.length - 1} more` : "";
                  return (
                    <tr key={o.id}>
                      <td>
                        <div className="cell-user">
                          <Avatar name={o.customer.name} size={36} />
                          <div>
                            <div className="cell-main">Order #{o.id}</div>
                            <div className="cell-sub">{first}{more} · {formatPrice(o.total)}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="cell-main">{o.customer.name}</div>
                        <div className="cell-sub">{o.customer.phone}</div>
                      </td>
                      <td>
                        <div className="cell-main">{formatDate(o.createdAt)}</div>
                        <div className="cell-sub">{formatTime(o.createdAt)}</div>
                      </td>
                      <td>
                        <button
                          type="button"
                          className={`pill pill--${o.status}`}
                          title="Click to change status"
                          onClick={() => onOrderCycle(o.id)}
                        >
                          {STATUS_LABELS[o.status] ?? o.status}
                        </button>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="icon-action"
                          aria-label={`Delete order ${o.id}`}
                          onClick={() => handleDelete(o)}
                        >
                          <Icon name="trash" size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
