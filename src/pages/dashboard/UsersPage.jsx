import { useOutletContext } from "react-router-dom";
import PageHeader from "../../components/dashboard/PageHeader";
import UsersTable from "../../components/dashboard/UsersTable";

export default function UsersPage() {
  const { users, usersStatus, refreshUsers } = useOutletContext();

  const sorted = [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <>
      <PageHeader title={usersStatus === "success" ? `Users (${users.length})` : "Users"}>
        <button type="button" className="dash-btn" onClick={refreshUsers}>Refresh</button>
      </PageHeader>
      <UsersTable users={sorted} status={usersStatus} />
    </>
  );
}
