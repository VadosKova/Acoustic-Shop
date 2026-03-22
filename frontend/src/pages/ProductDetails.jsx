import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API } from "../../api/api";
import Navbar from "../components/Navbar";

import HeartIcon from "../assets/icons/HeartIcon";
import CartIcon from "../assets/icons/CartIcon";
import ReviewIcon from "../assets/icons/ReviewIcon";

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [fav, setFav] = useState(false);

  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    API.get(`/api/products/${id}`).then(res => setProduct(res.data));
  }, [id]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites")) || [];
    const exists = saved.find(p => p.id === id);
    setFav(!!exists);
  }, [id]);

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

  function addToCart() {
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

    const saved = JSON.parse(localStorage.getItem("cart")) || [];

    const exists = saved.find(p => p.id === product.id);
    if (exists) return;

    const updated = [...saved, product];
    localStorage.setItem("cart", JSON.stringify(updated));
  }

  useEffect(() => {
    API.get(`/api/products/${id}/reviews`)
      .then(res => setReviews(res.data));
  }, [id]);

  function renderStars(rating = 0) {
    const fullStars = Math.round(rating);
    return "★".repeat(fullStars) + "☆".repeat(5 - fullStars);
  }

  function submitReview() {
    if (reviewRating === 0) {
        alert("Choose the count of stars");
        return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    API.post(`/api/products/${id}/review`, {
      name: user ? user.name : "Anonymous",
      rating: reviewRating,
      comment: reviewText || ""
    }).then(res => {
      setProduct(res.data);
      setReviews(res.data.reviews);
      setReviewText("");
      setReviewRating(0);
    });
  }

  if (!product) return <p>Loading...</p>;

  return (
    <div style={{ padding: 30 }}>
      <Navbar />
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 40
      }}>
        <div style={{
          background: "#f5f5f5",
          borderRadius: 12,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 20
        }}>
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{ maxWidth: "100%", maxHeight: 400 }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <h2>{product.name}</h2>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: "#f5a623", fontSize: 20 }}>
              {renderStars(product.rating)}
            </span>
            <ReviewIcon />
            <span>{product.reviewsCount || 0}</span>
          </div>

          <p style={{ color: product.inStock ? "green" : "red" }}>
            {product.inStock ? "In stock" : "Out of stock"}
          </p>

          {!isAdmin && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
                <h3>{product.priceEth} ETH</h3>

                <button
                  onClick={addToCart}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 16px",
                    background: "#42b883",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer"
                  }}
                >
                  <CartIcon /> Buy
                </button>

                <div style={{ cursor: "pointer" }}>
                  <HeartIcon
                    filled={fav}
                    onClick={(toggleFavorite)}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{ marginTop: 40 }}>
        <h3>Опис</h3>
        <p>{product.description || "No description"}</p>
      </div>

      <div style={{ marginTop: 30 }}>
        <h3>Характеристики</h3>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginTop: 10
        }}>
          <div>Матеріал: {product.specs?.material || "-"}</div>
          <div>Колір: {product.specs?.color || "-"}</div>
          <div>Кількість: {product.specs?.quantity || "-"}</div>
          <div>Продавець: {product.specs?.seller || "-"}</div>
        </div>
      </div>

      <div style={{ marginTop: 40 }}>
        <h3>Відгуки</h3>

        <div style={{ display: "flex", gap: 4 }}>
          {[1,2,3,4,5].map(n => (
            <span
              key={n}
              onClick={() => setReviewRating(n)}
              style={{
                cursor: "pointer",
                fontSize: 24,
                color: n <= reviewRating ? "#f5a623" : "#ccc"
              }}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Напишіть відгук..."
          className="review-textarea"
        />

        <button onClick={submitReview} style={{
          marginTop: 10,
          padding: "8px 14px",
          background: "#222",
          color: "#fff",
          border: "none",
          borderRadius: 6
        }}>
          Submit review
        </button>

        <div style={{ marginTop: 20 }}>
          {reviews.length === 0 ? (
            <p>Немає відгуків</p>
          ) : (
            reviews.map((r, i) => (
              <div key={i}>
                <div style={{color: "#f5a623"}}>{"★".repeat(r.rating)}</div>
                <h5>{r.name}</h5>
                <p>{r.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}