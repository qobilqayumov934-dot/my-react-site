import { Link } from "react-router-dom";
import { Icon } from "./Icon";

export default function TopBar() {
  return (
    <div className="topbar">
      <div className="container topbar__inner">
        <p>
          Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!
          <Link to="/">ShopNow</Link>
        </p>
        <button type="button" className="topbar__lang">
          English <Icon name="chevron" size={16} />
        </button>
      </div>
    </div>
  );
}
