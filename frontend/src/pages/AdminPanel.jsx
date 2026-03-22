import { useEffect, useState } from "react";
import { API } from "../../api/api";
import Navbar from "../components/Navbar";
import ReviewIcon from "../assets/icons/ReviewIcon";

export default function AdminPanel() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [products,setProducts] = useState([]);

  const [name,setName] = useState("");
  const [category,setCategory] = useState("");
  const [rating,setRating] = useState("");
  const [priceEth,setPriceEth] = useState("");
  const [image,setImage] = useState("");
  const [description,setDescription] = useState("");
  const [inStock,setInStock] = useState(true);

  const [editingId,setEditingId] = useState(null);

  const [showOrders,setShowOrders] = useState(false);
  const [orders,setOrders] = useState([]);

  const [ratingValue, setRatingValue] = useState(0);

  const [specs, setSpecs] = useState({
    material: "",
    color: "",
    quantity: 0,
    seller: ""
  });

  const categories = [
    "Навушники",
    "Портативні колонки",
    "Про-аудіо",
    "Звукозапис",
    "Акустичні системи",
    "Програвачі вінілу",
    "DJ-обладнання",
    "Медіаплеєри"
  ];

  useEffect(()=>{
    if(!user || user.email !== "admin@gmail.com"){
      alert("Access only for Admin");
      window.location.href="/";
      return;
    }
    loadProducts();
  },[]);

  async function loadProducts(){
    const res = await API.get("/api/products");
    setProducts(res.data);
  }

  function loadOrders(){
    const data = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(data);
  }

  function handleImageUpload(e){
    const file = e.target.files[0];
    if(!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  }

  function renderStars(rating = 0) {
    const fullStars = Math.round(rating);
    return "★".repeat(fullStars) + "☆".repeat(5 - fullStars);
  }

  async function addProduct(){
    if(
      !name.trim() ||
      !category.trim() ||
      !priceEth ||
      ratingValue === 0 ||
      !description.trim() ||
      !specs.trim()
    ){
      alert("Fill all fields correctly");
      return;
    }

    const product = {
      name,
      category,
      rating: ratingValue,
      priceEth: parseFloat(priceEth),
      imageUrl: image,
      description,
      specs,
      inStock: specs.quantity > 0,
    };

    await API.post("/api/products",product);
    clearForm();
    loadProducts();
  }

  async function deleteProduct(id){
    if(!confirm("Delete product?")) return;

    await API.delete(`/api/products/${id}`);
    loadProducts();
  }

  function editProduct(p){
    setEditingId(p.id);

    setName(p.name);
    setCategory(p.category);
    setRating(p.rating);
    setPriceEth(p.priceEth);
    setImage(p.imageUrl);
  }

  async function updateProduct(){
    const product = {
      id: editingId,
      name,
      category,
      rating: parseFloat(rating),
      priceEth: parseFloat(priceEth),
      imageUrl: image
    };

    await API.put(`/api/products/${editingId}`,product);

    setEditingId(null);
    clearForm();
    loadProducts();
  }

  async function updateStock(index, delta) {
    const updated = [...products];
    const item = updated[index];

    const currentQty = item.specs?.quantity || 0;
    const newQty = currentQty + delta;

    if (newQty < 0) return;

    item.specs.quantity = newQty;
    item.inStock = newQty > 0;

    setProducts(updated);

    await API.put(`/api/products/${item.id}`, item);
  }

  function clearForm(){
    setName("");
    setCategory("");
    setRating("");
    setPriceEth("");
    setImage("");
  }

  return (
    <div className="catalog-container">
      <Navbar />

      <button onClick={()=>{
          loadOrders();
          setShowOrders(!showOrders);
        }}>
          История заказов
      </button>
      
      <div className="catalog-admin">
        <h2>Product Manager</h2>

        <div className="product-form">
          <div className="image-upload">
            {image ? (
              <img src={image} className="product-preview"/>
            ) : (
              <div className="image-placeholder">
                Upload Image
              </div>
            )}

            <input type="file" onChange={handleImageUpload}/>
          </div>

          <input
            placeholder="Product Name"
            value={name}
            onChange={e=>setName(e.target.value)}
          />

          <select value={category} onChange={e=>setCategory(e.target.value)}>
            <option value="">Select category</option>
            {categories.map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <div style={{ display: "flex", gap: 4 }}>
            {[1,2,3,4,5].map(n => (
              <span
                key={n}
                onClick={() => setRatingValue(n)}
                style={{
                  cursor: "pointer",
                  fontSize: 20,
                  color: n <= ratingValue ? "#f5a623" : "#ccc"
                }}
              >
                ★
              </span>
            ))}
          </div>

          <input
            placeholder="Price ETH"
            value={priceEth}
            onChange={e=>setPriceEth(e.target.value)}
          />

          <input
            placeholder="Description"
            value={description}
            onChange={e=>setDescription(e.target.value)}
          />

          <input
            placeholder="Material"
            onChange={e=>setSpecs({...specs, material: e.target.value})}
          />

          <input
            placeholder="Color"
            onChange={e=>setSpecs({...specs, color: e.target.value})}
          />

          <input
            placeholder="Quantity"
            type="number"
            onChange={e=>setSpecs({...specs, quantity: parseInt(e.target.value)})}
          />

          <input
            placeholder="Seller"
            onChange={e=>setSpecs({...specs, seller: e.target.value})}
          />

          {editingId ? (
            <button onClick={updateProduct}>
              Update Product
            </button>
          ) : (
            <button onClick={addProduct}>Add Product</button>
          )}
        </div>

        <h3>All Products</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {products.map((p, index) => (
            <div key={p.id} className="cart-item">
              <img src={p.imageUrl} />

              <div className="cart-info">
                <h4>{p.name}</h4>

                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: "#f5a623", fontSize: 18 }}>
                    {renderStars(p.rating)}
                  </span>
                  <span>({p.reviewsCount || 0})</span>
                </div>

                <p style={{ color: p.inStock ? "green" : "red" }}>
                  {p.inStock ? "In stock" : "Out of stock"}
                </p>

                <p>{p.priceEth} ETH</p>

                <div className="quantity-box">
                  <button disabled={p.specs?.quantity <= 0}
                    onClick={() => updateStock(index, -1)}
                  >-</button>
                  <span>{p.specs?.quantity || 0}</span>
                  <button onClick={() => updateStock(index, 1)}>+</button>
                </div>
              </div>

              <div className="cart-actions">
                <button onClick={() => editProduct(p)}>Edit</button>
                <button onClick={() => deleteProduct(p.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
        {showOrders && (
          <div className="orders-panel">
            {orders.map((o,i)=>(
              <div key={i}>
                <p>{o.user}</p>
                <p>{new Date(o.date).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}