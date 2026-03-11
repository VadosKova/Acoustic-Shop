import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ cartCount = 0 }) {
  const navigate = useNavigate();

  function openCatalog(){
    const user = JSON.parse(localStorage.getItem("user"));

    if(!user || user.role !== "Admin"){
      alert("Catalog available only for Admin");
      return;
    }
    navigate("/catalog");
  }

  return (
    <nav>
      <ul className="nav-menu">
        <li><Link to="/" className="nav-link">Home</Link></li>
        <li><button className="nav-link" onClick={openCatalog}style={{background:"none",border:"none"}}>Catalog</button></li>
        <li><Link to="/cart" className="nav-link">Cart ({cartCount})</Link></li>
        <li><Link to="/profile" className="nav-link">Profile</Link></li>
      </ul>
    </nav>
  );
}