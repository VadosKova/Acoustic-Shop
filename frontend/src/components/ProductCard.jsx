import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import HeartIcon from "../assets/icons/HeartIcon";
import ReviewIcon from "../assets/icons/ReviewIcon";
import CartIcon from "../assets/icons/CartIcon";

export default function ProductCard({ product, onBuy, hideFavorite = false, isAdmin }) {
  const navigate = useNavigate();
  const [fav, setFav] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites")) || [];
    const exists = saved.find(p => p.id === product.id);
    setFav(!!exists);
  }, [product]);

  function toggleFavorite(e) {
    e.stopPropagation();

    const user = JSON.parse(localStorage.getItem("user"));
    const isAdmin = user?.email === "admin@gmail.com";

    if(!user){
      alert("You need to Sign In");
      return;
    }

    if(isAdmin){
      alert("Admin cannot use favorites");
      return;
    }

    const saved = JSON.parse(localStorage.getItem("favorites")) || [];

    if (fav) {
      const updated = saved.filter(p => p.id !== product.id);
      localStorage.setItem("favorites", JSON.stringify(updated));
      setFav(false);
    } else {
      localStorage.setItem("favorites", JSON.stringify([...saved, product]));
      setFav(true);
    }
  }

  function addToCart(e) {
    e.stopPropagation();

    const user = JSON.parse(localStorage.getItem("user"));
    const isAdmin = user?.email === "admin@gmail.com";

    if(!user){
      alert("You need to Sign In");
      return;
    }

    if(isAdmin){
      alert("Admin cannot use cart");
      return;
    }

    onBuy && onBuy(product);
  }

  function renderStars(rating = 0) {
    const fullStars = Math.round(rating);
    return "★".repeat(fullStars) + "☆".repeat(5 - fullStars);
  }

  function goToDetails() {
    navigate(`/product/${product.id || product._id}`);
  }

  return (
    <div onClick={goToDetails} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{
      border: "1px solid #ddd",
      borderRadius: 10,
      width: "100%",
      maxWidth: 300,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      backgroundColor: "#fff",
      boxShadow: hovered
        ? "0 8px 20px rgba(0,0,0,0.15)"
        : "0 2px 6px rgba(0,0,0,0.1)",
      padding: 16,
      boxSizing: "border-box",
      height: 400,
      position: "relative",
      transform: hovered ? "translateY(-6px)" : "translateY(0)",
      transition: "all 0.25s ease",
      cursor: "pointer"
    }}>
      <div style={{
        width: "100%",
        height: 180,
        overflow: "hidden",
        borderRadius: 8,
        marginBottom: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        flexShrink: 0
      }}>
        <img
          src={product.imageUrl}
          alt={product.name}
          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", transform: hovered ? "scale(1.05)" : "scale(1)", transition: "transform 0.3s ease" }}
        />
      </div>

      <div style={{ 
        flexGrow: 1, 
        display: "flex", 
        flexDirection: "column" 
      }}>
        <h4 style={{ 
          fontSize: "16px", 
          margin: "0 0 8px 0",
          height: "2.4em",
          lineHeight: "1.2em",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}>
          {product.name}
        </h4>
        
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <span style={{ color: "#f5a623", fontSize: 20 }}>
            {renderStars(product.rating)}
          </span>
          <br/>
          <ReviewIcon />
          <span style={{ fontSize: 13, color: "#666" }}>
            {product.reviewsCount || 0}
          </span>
        </div>

        <p style={{ margin: "0 0 12px 0", fontWeight: "bold", fontSize: 25 }}>
          {product.priceEth} ETH
        </p>
      </div>
      <div style={{
        position: "absolute",
        bottom: 12,
        right: 12,
        display: "flex",
        gap: 10,
        alignItems: "center",
        opacity: hovered ? 1 : 0.7,
        transform: hovered ? "translateY(0)" : "translateY(6px)",
        transition: "all 0.25s ease"
      }}>
        {!isAdmin && (
          <>
            {!hideFavorite && (
              <div style={{ cursor: "pointer", transform: hovered ? "scale(1.1)" : "scale(1)", transition: "transform 0.2s" }}>
                <HeartIcon
                  filled={fav}
                  onClick={toggleFavorite}
                />
              </div>
            )}

            <div onClick={addToCart} style={{ cursor: "pointer" }}>
              <CartIcon />
            </div>
          </>
        )}
      </div>
    </div>
  );
}