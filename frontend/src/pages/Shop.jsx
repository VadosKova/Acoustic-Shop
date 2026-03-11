import { useEffect, useState } from "react";
import { API } from "../../api/api";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [searchTerm,setSearchTerm] = useState("")
  const [category,setCategory] = useState("")
  const [loading,setLoading] = useState(true)

  const [cart,setCart] = useState([])

  const categories = [
    "Навушники",
    "Портативні колонки",
    "Про-аудіо",
    "Звукозапис",
    "Акустичні системи",
    "Програвачі вінілу",
    "DJ-обладнання",
    "Медіаплеєри"
  ]

  useEffect(() => {
    setLoading(true)
    API.get("/api/products")
      .then(res=>{
        setProducts(res.data)
        setFilteredProducts(res.data)
      })
      .finally(()=>{
        setLoading(false)
      })
  }, []);

  return (
    <div className="shop-container">
      <header className="shop-navbar">
        <span className="shop-logo">Acoustic Shop</span>
        <form className="d-flex" role="search" onSubmit={e => e.preventDefault()}>
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-outline-success" type="submit">Search</button>
        </form>
      </header>

      <Navbar cartCount={cart.length} />
    </div>
  );
}