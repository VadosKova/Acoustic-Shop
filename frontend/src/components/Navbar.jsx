import { Link } from "react-router-dom";

export default function Navbar({ cartCount = 0 }) {

  return (
    <nav>
      <ul className="nav-menu">
        <li><Link to="/" className="nav-link">Home</Link></li>
        <li><Link to="/cart" className="nav-link">Cart ({cartCount})</Link></li>
        <li><Link to="/profile" className="nav-link">Profile</Link></li>
      </ul>
    </nav>
  );
}