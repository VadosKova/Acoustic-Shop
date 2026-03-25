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
        items: cart.map(p => ({
          productId: p.id,
          name: p.name,
          priceEth: p.priceEth,
          quantity: p.quantity,
          imageUrl: p.imageUrl
        })),
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

      <div>
        <p><b>Name:</b> {user?.name}</p>
        <p><b>Email:</b> {user?.email}</p>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Delivery</h3>

        <input
          placeholder="City"
          value={city}
          onChange={handleCitySearch}
        />

        {cities.length > 0 && (
          <div style={{
            border: "1px solid #ccc",
            marginTop: 5,
            borderRadius: 6
          }}>
            {cities.map((c, i) => (
              <div
                key={i}
                style={{ padding: 8, cursor: "pointer" }}
                onClick={() => selectCity(c)}
              >
                {c.Present}
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 10 }}>
          <input
            placeholder="Select warehouse"
            value={warehouse}
            onFocus={() => setShowWarehouses(true)}
            onChange={(e) => {
              setWarehouse(e.target.value);
              setShowWarehouses(true);
            }}
          />

          {showWarehouses && warehouses.length > 0 && (
            <div style={{
              border: "1px solid #ccc",
              marginTop: 5,
              borderRadius: 6,
              maxHeight: 200,
              overflowY: "auto"
            }}>
              {warehouses.slice(0, 10).map((w, i) => (
                <div
                  key={i}
                  style={{ padding: 8, cursor: "pointer" }}
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
      </div>

      <div style={{ marginTop: 30 }}>
        <h3>Items</h3>

        {cart.map((item,i)=>(
          <div key={i}>
            {item.name} x {item.quantity} —{" "}
            {(item.priceEth * item.quantity).toFixed(4)} ETH
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        <p>Products: {total.toFixed(4)} ETH</p>
        <p>Delivery: {deliveryFee} ETH</p>
        <h3>Total: {finalTotal.toFixed(4)} ETH</h3>
      </div>

      {status && (
        <p style={{ marginTop: 10 }}>{status}</p>
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