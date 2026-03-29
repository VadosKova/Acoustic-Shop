import { Link } from "react-router-dom";

export default function Navbar({ cartCount = 0 }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.email === "admin@gmail.com";

  return (
    <nav>
      <ul className="nav-menu">
        <li><Link to="/" className="nav-link">Home</Link></li>
        {!isAdmin && (
          <li>
            <Link to="/cart" className="nav-link">
              Cart ({cartCount})
            </Link>
          </li>
        )}
        {isAdmin && (
          <li>
            <Link to="/admin-panel" className="nav-link">
              Admin Panel
            </Link>
          </li>
        )}
        <li><Link to="/profile" className="nav-link">Profile</Link></li>
      </ul>
    </nav>
  );
}