import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API } from "../../api/api";

import HeartIcon from "../assets/icons/HeartIcon";
import CartIcon from "../assets/icons/CartIcon";
import ReviewIcon from "../assets/icons/ReviewIcon";

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [fav, setFav] = useState(false);

  useEffect(() => {
    API.get(`/api/products/${id}`).then(res => setProduct(res.data));
  }, [id]);

  function addToCart() {
    const saved = JSON.parse(localStorage.getItem("cart")) || [];
    localStorage.setItem("cart", JSON.stringify([...saved, product]));
  }

  if (!product) return <p>Loading...</p>;

  return (
    <div style={{ padding: 30 }}>
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
              {"★".repeat(Math.round(product.rating || 0))}
            </span>
            <ReviewIcon />
            <span>{product.reviewsCount || 0}</span>
          </div>

          <p style={{ color: product.inStock ? "green" : "red" }}>
            {product.inStock ? "In stock" : "Out of stock"}
          </p>

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
                onClick={() => setFav(!fav)}
              />
            </div>
          </div>
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
          <div>Матеріал: {product.material || "-"}</div>
          <div>Колір: {product.color || "-"}</div>
          <div>Кількість: {product.quantity || "-"}</div>
          <div>Продавець: {product.seller || "-"}</div>
        </div>
      </div>

      <div style={{ marginTop: 40 }}>
        <h3>Відгуки</h3>
        <textarea
          placeholder="Напишіть відгук..."
          style={{
            width: "100%",
            height: 80,
            marginTop: 10,
            padding: 10
          }}
        />

        <button style={{
          marginTop: 10,
          padding: "8px 14px",
          background: "#222",
          color: "#fff",
          border: "none",
          borderRadius: 6
        }}>
          Submit review
        </button>
      </div>
    </div>
  );
}