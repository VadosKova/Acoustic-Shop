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

  useEffect(()=>{
    let result = products

    if(searchTerm)
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      )

    if(category)
      result = result.filter(p => p.category === category)
    setFilteredProducts(result)
  },[searchTerm,category,products])

  function addToCart(product){
    const saved = JSON.parse(localStorage.getItem("cart")) || [];
    const updated = [...saved,product];

    localStorage.setItem("cart",JSON.stringify(updated));
    setCart(updated);
  }

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

      <main className="main-layout">
        <aside className="filter-sidebar">
          <h3>Категорії</h3>
          <ul className="category-list">
            {categories.map(cat => (
              <li key={cat} className="category-item">
                <input
                  type="radio"
                  id={cat}
                  name="category"
                  checked={category === cat}
                  onChange={() => setCategory(cat)}
                />
                <label htmlFor={cat}>{cat}</label>
              </li>
            ))}
          </ul>
          <button className="reset-button" onClick={() => setCategory("")}>
            Reset Filters
          </button>
        </aside>

        <section className="products-content">
          {loading ? (
            <Spinner />
          ) : (
            <div className="products-grid">
              {filteredProducts.map(p => (
                <ProductCard key={p.id} product={p} onBuy={addToCart} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}