import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { API } from "../../api/api";
import { ethers } from "ethers";

export default function OrderDetails() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  const [city, setCity] = useState("");
  const [cities, setCities] = useState([]);
  const [cityRef, setCityRef] = useState("");

  const [warehouse, setWarehouse] = useState("");
  const [warehouses, setWarehouses] = useState([]);
  const [showWarehouses, setShowWarehouses] = useState(false);

  const [status, setStatus] = useState("");


  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("checkout_cart")) || [];
    const u = JSON.parse(localStorage.getItem("user"));

    setCart(savedCart);
    setUser(u);
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.priceEth * item.quantity,
    0
  );

  const deliveryFee = 0.01;
  const finalTotal = total + deliveryFee;

  const statusColor = {
    "Waiting for payment...": "#f5a623",
    "Payment successful": "#42b883",
    "Payment failed": "#ff4d4d"
  };

  async function handleCitySearch(e) {
    const query = e.target.value;
    setCity(query);

    if (query.length < 2) {
      setCities([]);
      return;
    }

    try {
      const res = await fetch("https://api.novaposhta.ua/v2.0/json/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: "49e22586b343465c346f07a2b3373af5",
          modelName: "Address",
          calledMethod: "searchSettlements",
          methodProperties: {
            CityName: query,
            Limit: 5
          }
        })
      });

      const data = await res.json();
      setCities(data.data[0]?.Addresses || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function selectCity(cityObj) {
    setCity(cityObj.Present);
    setCityRef(cityObj.Ref);
    setCities([]);

    try {
      const res = await fetch("https://api.novaposhta.ua/v2.0/json/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: "49e22586b343465c346f07a2b3373af5",
          modelName: "Address",
          calledMethod: "getWarehouses",
          methodProperties: {
            CityRef: cityObj.Ref
          }
        })
      });

      const data = await res.json();
      setWarehouses(data.data || []);
      setShowWarehouses(true);
    } catch (err) {
      console.error(err);
    }
  }

  async function submitOrder(){
    if (!user) {
      alert("Login first");
      return;
    }

    if (!cityRef || !warehouse) {
      alert("Fill delivery info");
      return;
    }

    if (!window.ethereum) {
      alert("Install MetaMask");
      return;
    }

    try {
      setStatus("Waiting for payment...");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tx = await signer.sendTransaction({
        to: import.meta.env.VITE_CONTRACT_ADDRESS,
        value: ethers.parseEther(finalTotal.toString())
      });

      await tx.wait();

      setStatus("Payment successful");

      const order = {
        userId: user.email,
        items: cart,
        totalPriceEth: finalTotal,
        status: "Processing",
        city,
        warehouse
      };

      await API.post("/api/orders", order);

      localStorage.removeItem("cart");
      localStorage.removeItem("checkout_cart");

      alert("Order created successfully!");
    } catch (err) {
      console.error(err);
      setStatus("Payment failed");
    }
  }

  return (
    <div style={{ maxWidth: 1000, margin: "40px auto", padding: 20 }}>
      <Navbar />

      <h2 style={{ marginBottom: 20 }}>Order Details</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 400px",
        gap: 30
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 20
        }}>
          <div style={cardStyle}>
            <h3>User Info</h3>
            <p><b>Name:</b> {user?.name}</p>
            <p><b>Email:</b> {user?.email}</p>
          </div>

          <div style={cardStyle}>
            <h3>Delivery Info</h3>

            <input
              placeholder="City"
              value={city}
              onChange={handleCitySearch}
              style={inputStyle}
            />

            {cities.length > 0 && (
              <div style={dropdownStyle}>
                {cities.map((c, i) => (
                  <div
                    key={i}
                    style={dropdownItem}
                    onClick={() => selectCity(c)}
                  >
                    {c.Present}
                  </div>
                ))}
              </div>
            )}

            <input
              placeholder="Warehouse"
              value={warehouse}
              onFocus={() => setShowWarehouses(true)}
              onChange={(e) => {
                setWarehouse(e.target.value);
                setShowWarehouses(true);
              }}
              style={inputStyle}
            />

            {showWarehouses && warehouses.length > 0 && (
              <div style={dropdownStyle}>
                {warehouses.slice(0, 15).map((w, i) => (
                  <div
                    key={i}
                    style={dropdownItem}
                    onClick={() => {
                      setWarehouse(w.Description);
                      setShowWarehouses(false);
                    }}
                  >
                    {w.Description}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={cardStyle}>
            <h3>Items</h3>

            {cart.map((item, i) => (
              <div key={i} style={itemStyle}>
                <img src={item.imageUrl} style={imgStyle} />
                <div>
                  <b>{item.name}</b>
                  <p>{item.quantity} x {item.priceEth} ETH</p>
                </div>
              </div>
            ))}
          </div>

        </div>

        <div style={cardStyle}>
          <h3>Order Summary</h3>

          {cart.map((item, i) => (
            <div key={i} style={summaryRow}>
              <span>{item.name} x {item.quantity}</span>
              <span>
                {(item.priceEth * item.quantity).toFixed(4)} ETH
              </span>
            </div>
          ))}

          <hr />

          <p>Products: {total.toFixed(4)} ETH</p>
          <p>Delivery: {deliveryFee} ETH</p>

          <h3 style={{ marginTop: 10 }}>
            Total: {finalTotal.toFixed(4)} ETH
          </h3>

          {status && (
            <p style={{
              marginTop: 10,
              color: statusColor[status],
              fontWeight: "bold"
            }}>
              {status}
            </p>
          )}

          <button onClick={submitOrder} style={buttonStyle}>
            Pay & Confirm
          </button>
        </div>

      </div>
    </div>
  );
}

const cardStyle = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: 10,
  borderRadius: 8,
  border: "1px solid #ddd"
};

const dropdownStyle = {
  border: "1px solid #ddd",
  borderRadius: 8,
  marginTop: 5,
  maxHeight: 200,
  overflowY: "auto",
  background: "#fff",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
};

const dropdownItem = {
  padding: 10,
  cursor: "pointer",
  borderBottom: "1px solid #f0f0f0"
};

const itemStyle = {
  display: "flex",
  alignItems: "center",
  gap: 15,
  marginBottom: 10
};

const imgStyle = {
  width: 60,
  height: 60,
  objectFit: "cover",
  borderRadius: 6
};

const summaryRow = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 10
};

const buttonStyle = {
  marginTop: 20,
  width: "100%",
  padding: "14px",
  background: "#42b883",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  fontWeight: "600",
  cursor: "pointer",
  fontSize: 16
};