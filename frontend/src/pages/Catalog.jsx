import { useEffect, useState } from "react";
import { API } from "../../api/api";
import Navbar from "../components/Navbar";

export default function Catalog() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [products,setProducts] = useState([]);

  const [name,setName] = useState("");
  const [category,setCategory] = useState("");
  const [rating,setRating] = useState("");
  const [priceEth,setPriceEth] = useState("");
  const [image,setImage] = useState("");

  const [editingId,setEditingId] = useState(null);

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
    if(!user || user.role !== "Admin"){
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

  function handleImageUpload(e){
    const file = e.target.files[0];
    if(!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  }

  async function addProduct(){
    if(!name || !category || !rating || !priceEth){
      alert("Fill all fields");
      return;
    }

    const product = {
      name,
      category,
      rating: parseFloat(rating),
      priceEth: parseFloat(priceEth),
      imageUrl: image
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

  return (
    <div className="catalog-container">
      <Navbar cartCount={cart.length} />
      
    </div>
  );
}