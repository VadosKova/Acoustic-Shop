export default function ProductCard({ product, onBuy }) {
  const user = JSON.parse(localStorage.getItem("user"));

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
      height: 420,
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
        
        <p style={{ margin: "0 0 8px 0" }}>⭐ {product.rating}</p>
        <p style={{ margin: "0 0 12px 0", fontWeight: "bold" }}>{product.priceEth} ETH</p>

        <button
          disabled={!user}
          onClick={() => {
            if(!user){
              alert("Please login first");
              return;
            }

            onBuy(product);
          }}
          style={{
            marginTop: "auto",
            padding: "10px 12px",
            borderRadius: 6,
            border: "none",
            backgroundColor: "#28a745",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "0.2s"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#218838"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#28a745"}
        >
          Buy
        </button>
      </div>
    </div>
  );
}