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


  return (
    <div className="catalog-container">
      <Navbar cartCount={cart.length} />
      
    </div>
  );
}