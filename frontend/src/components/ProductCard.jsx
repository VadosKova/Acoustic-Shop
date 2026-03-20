import { useNavigate } from "react-router-dom";
import { useState } from "react";

import HeartIcon from "../assets/icons/HeartIcon";
import ReviewIcon from "../assets/icons/ReviewIcon";
import CartIcon from "../assets/icons/CartIcon";

export default function ProductCard({ product, onBuy }) {
  const navigate = useNavigate();
  const [fav, setFav] = useState(false);

  function addToCart(e) {
    e.stopPropagation();

    const saved = JSON.parse(localStorage.getItem("cart")) || [];
    localStorage.setItem("cart", JSON.stringify([...saved, product]));

    onBuy && onBuy(product);
  }

  function renderStars(rating = 0) {
    const fullStars = Math.round(rating);
    return "★".repeat(fullStars) + "☆".repeat(5 - fullStars);
  }

  return (
    <div style={{
      border: "1px solid #ddd",
      borderRadius: 10,
      width: "100%",
      maxWidth: 300,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      backgroundColor: "#fff",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      padding: 16,
      boxSizing: "border-box",
      height: 400,
      position: "relative"
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
          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
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

          <ReviewIcon />
          <span style={{ fontSize: 13, color: "#666" }}>
            {product.reviewsCount || 0}
          </span>
        </div>

        <p style={{ margin: "0 0 12px 0", fontWeight: "bold", fontSize: 20 }}>
          {product.priceEth} ETH
        </p>
      </div>
      <div style={{
        position: "absolute",
        bottom: 12,
        right: 12,
        display: "flex",
        gap: 10,
        alignItems: "center"
      }}>
        <div style={{ cursor: "pointer" }}>
          <HeartIcon
            filled={fav}
            onClick={(e) => {
              e.stopPropagation();
              setFav(!fav);
            }}
          />
        </div>

        <div onClick={addToCart} style={{ cursor: "pointer" }}>
          <CartIcon />
        </div>
      </div>
    </div>
  );
}