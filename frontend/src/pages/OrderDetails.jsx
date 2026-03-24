import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { API } from "../../api/api";
import { ethers } from "ethers";

export default function OrderDetails() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  const [city, setCity] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedCityRef, setSelectedCityRef] = useState("");
  const [status, setStatus] = useState("");
  const [warehouse, setWarehouse] = useState("");

  const [warehouses, setWarehouses] = useState([]);

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

  async function searchCities(query){
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
    return data.data[0].Addresses;
  }

  async function getWarehouses(cityRef){
    const res = await fetch("https://api.novaposhta.ua/v2.0/json/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apiKey: "49e22586b343465c346f07a2b3373af5",
        modelName: "Address",
        calledMethod: "getWarehouses",
        methodProperties: {
          CityRef: cityRef
        }
      })
    });

    const data = await res.json();
    return data.data;
  }

  useEffect(() => {
    if(city){
      setWarehouses([
        "Відділення №1",
        "Відділення №2",
        "Відділення №3"
      ]);
    }
  }, [city]);

  async function submitOrder(){
    const order = {
      userId: user.email,
      items: cart.map(p => ({
        productId: p.id,
        name: p.name,
        priceEth: p.priceEth,
        quantity: p.quantity,
        imageUrl: p.imageUrl
      })),
      totalPriceEth: finalTotal
    };

    await API.post("/api/orders", order);

    localStorage.removeItem("cart");
    localStorage.removeItem("checkout_cart");

    alert("Замовлення оформлено");
  }

  return (
    <div style={{ padding: 30 }}>
      <Navbar />

      <h2>Order Details</h2>

      <div>
        <p><b>Name:</b> {user?.name}</p>
        <p><b>Email:</b> {user?.email}</p>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Delivery</h3>

        <input
          placeholder="City"
          value={city}
          onChange={(e)=>setCity(e.target.value)}
        />

        <div style={{ marginTop: 10 }}>
          <input
            placeholder="Select warehouse"
            value={warehouse}
            onChange={(e)=>setWarehouse(e.target.value)}
          />

          {warehouse && (
            <div style={{
              border: "1px solid #ccc",
              padding: 10,
              marginTop: 5
            }}>
              {warehouses.map((w,i)=>(
                <div
                  key={i}
                  style={{ cursor: "pointer" }}
                  onClick={()=>setWarehouse(w)}
                >
                  {w}
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

      <button
        onClick={submitOrder}
        style={{
          marginTop: 20,
          padding: "10px 16px",
          background: "#42b883",
          color: "#fff",
          border: "none",
          borderRadius: 8
        }}
      >
        Confirm Order
      </button>
    </div>
  );
}