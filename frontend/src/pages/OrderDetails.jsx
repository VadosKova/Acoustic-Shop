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
    <div style={{ maxWidth: 1100, margin: "40px auto", padding: 20 }}>
      <Navbar />

      <h2 style={{ marginBottom: 20 }}>Order Details</h2>

      <div style={{ background: "#fff", padding: 20, borderRadius: 10, marginBottom: 20 }}>
        <h3>User Info</h3>
        <p><b>Name:</b> {user?.name}</p>
        <p><b>Email:</b> {user?.email}</p>
      </div>

      <div style={{ background: "#fff", padding: 20, borderRadius: 10, marginBottom: 20 }}>
        <h3>Delivery</h3>

        <input
          placeholder="City"
          value={city}
          onChange={handleCitySearch}
        />

        {cities.length > 0 && (
          <div className="dropdown">
            {cities.map((c, i) => (
              <div key={i} onClick={() => selectCity(c)}>
                {c.Present}
              </div>
            ))}
          </div>
        )}

        <input
          placeholder="Select warehouse"
          value={warehouse}
          onFocus={() => setShowWarehouses(true)}
          onChange={(e) => setWarehouse(e.target.value)}
        />

        {showWarehouses && warehouses.length > 0 && (
          <div className="dropdown">
            {warehouses.slice(0, 10).map((w, i) => (
              <div key={i}
                onClick={() => {
                  setWarehouse(w.Description);
                  setShowWarehouses(false);
                }}>
                {w.Description}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ background: "#fff", padding: 20, borderRadius: 10}}>
        <h3>Items</h3>

        {cart.map((item,i)=>(
          <div key={i} style={{
            display: "flex",
            alignItems: "center",
            gap: 15,
            marginBottom: 10
          }}>
            <img src={item.imageUrl} width={60} />
            <div>
              <b>{item.name}</b>
              <p>{item.quantity} x {item.priceEth} ETH</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        <p>Products: {total.toFixed(4)} ETH</p>
        <p>Delivery: {deliveryFee} ETH</p>
        <h3>Total: {finalTotal.toFixed(4)} ETH</h3>
      </div>

      {status && (
        <p style={{
          marginTop: 10,
          color: statusColor[status] || "#000",
          fontWeight: "bold"
        }}>
          {status}
        </p>
      )}

      <button
        onClick={submitOrder}
        style={{
          marginTop: 20,
          padding: "10px 16px",
          background: "#42b883",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          cursor: "pointer"
        }}
      >
        Pay & Confirm Order
      </button>
    </div>
  );
}