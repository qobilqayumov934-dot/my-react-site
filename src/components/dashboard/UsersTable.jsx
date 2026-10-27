import Avatar from "./Avatar";
import { formatDate } from "../../utils/format";

export default function UsersTable({ users, status }) {
  if (status === "loading") return <p className="dash__status">Loading users…</p>;
  if (status === "error") {
    return <p className="dash__status dash__status--error">Could not load users. Try again later.</p>;
  }
  if (users.length === 0) return <p className="dash__status">No users yet.</p>;

  return (
    <div className="dash-scroll">
      <table className="dash-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Joined</th>
            <th>Country</th>
            <th>Status</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>
                <div className="cell-user">
                  <Avatar name={u.name} />
                  <div>
                    <div className="cell-main">{u.name}</div>
                    <div className="cell-sub">{u.email}</div>
                  </div>
                </div>
              </td>
              <td>{formatDate(u.createdAt)}</td>
              <td>{u.country || "—"}</td>
              <td className={u.isActive ? "t-green" : "t-red"}>{u.isActive ? "Active" : "Inactive"}</td>
              <td>{u.phone_number || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
