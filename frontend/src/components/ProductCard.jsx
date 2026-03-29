import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { API } from "../../api/api";

import HeartIcon from "../assets/icons/HeartIcon";
import ReviewIcon from "../assets/icons/ReviewIcon";
import CartIcon from "../assets/icons/CartIcon";

export default function ProductCard({ product, onBuy, hideFavorite = false, isAdmin, onFavoriteToggle }) {
  const navigate = useNavigate();
  const [fav, setFav] = useState(false);
  const [hovered, setHovered] = useState(false);

  const name = product.Name || product.name;
  const image = product.ImageUrl || product.imageUrl;
  const price = product.PriceEth || product.priceEth;
  const rating = product.Rating || product.rating;
  const quantity = product.Specs?.Quantity;
  const inStock = product.InStock;

  const isOutOfStock = product.InStock === false || quantity === 0;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      setFav(false);
      return;
    }

    const productId = product.id || product._id;

    const exists = user.favoriteProductIds?.includes(productId);
    setFav(!!exists);
  }, [product]);

  async function toggleFavorite(e) {
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

    if (isOutOfStock) return;

    const productId = product.id || product._id;

    try {
      if (fav) {
        await API.delete(`/api/auth/favorite/${user.id}/${productId}`);
        setFav(false);

        user.favoriteProductIds = user.favoriteProductIds.filter(id => id !== productId);
      } else {
        const res = await API.post(`/api/auth/favorite/${user.id}/${productId}`);
        setFav(true);

        user.favoriteProductIds = res.data.favoriteProductIds;
      }

      localStorage.setItem("user", JSON.stringify(user));

      if (onFavoriteToggle) {
        onFavoriteToggle(product.id || product._id);
      }

    } catch (err) {
      console.error(err);
      alert("Error updating favorites");
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
    if (isOutOfStock) return;
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
      backgroundColor: isOutOfStock ? "#f3f3f3" : "#fff",
      boxShadow: hovered
        ? "0 8px 20px rgba(0,0,0,0.15)"
        : "0 2px 6px rgba(0,0,0,0.1)",
      padding: 16,
      boxSizing: "border-box",
      height: 400,
      position: "relative",
      transform: hovered ? "translateY(-6px)" : "translateY(0)",
      transition: "all 0.25s ease",
      cursor: isOutOfStock ? "not-allowed" : "pointer",
      opacity: isOutOfStock ? 0.6 : 1,
      filter: isOutOfStock ? "grayscale(100%)" : "none"
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
        flexShrink: 0
      }}>
        <img
          src={image}
          alt={name}
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
          {name}
        </h4>
        
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <span style={{ color: "#f5a623", fontSize: 20 }}>
            {renderStars(rating)}
          </span>
          <br/>
          <ReviewIcon />
          <span style={{ fontSize: 13, color: "#666" }}>
            {product.reviewsCount || 0}
          </span>
        </div>

        <p style={{ margin: "0 0 12px 0", fontWeight: "bold", fontSize: 25 }}>
          {price} ETH
        </p>

        {isOutOfStock && (
          <p style={{ color: "red", fontWeight: "bold" }}>
            Out of stock
          </p>
        )}
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
              <div style={{ cursor: isOutOfStock ? "not-allowed" : "pointer", transform: hovered ? "scale(1.1)" : "scale(1)", transition: "transform 0.2s" }}>
                <HeartIcon
                  filled={fav}
                  onClick={toggleFavorite}
                />
              </div>
            )}

            <div onClick={addToCart} style={{ cursor: isOutOfStock ? "not-allowed" : "pointer" }}>
              <CartIcon />
            </div>
          </>
        )}
      </div>
    </div>
  );
}