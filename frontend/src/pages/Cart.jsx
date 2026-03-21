import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function Cart() {
  const [cart,setCart] = useState([]);
  const [user,setUser] = useState(null);

  useEffect(()=>{
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);

    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);
  },[]);

  function updateQuantity(index, delta){
    const updated = [...cart];
    const item = updated[index];

    if(delta === -1 && item.quantity === 1) return;
    item.quantity += delta;

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  }

  function removeFromCart(index){
    const updated = cart.filter((_,i)=> i !== index);

    setCart(updated);
    localStorage.setItem("cart",JSON.stringify(updated));
  }

  function checkout(){
    if(!user){
      alert("Only authorized users");
      return;
    }

    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    orders.push({
      user: user.email,
      items: cart,
      date: new Date().toISOString()
    });

    localStorage.setItem("orders", JSON.stringify(orders));
    localStorage.removeItem("cart");

    setCart([]);
    alert("Заказ оформлен");
  }

  return (
    <div className="cart-container">
      <Navbar/>

      <h2>Shopping Cart</h2>
      <button onClick={connectWallet}>Connect MetaMask</button>

      <p><b>Wallet:</b> {account || "not connected"}</p>
      {account && (
        <>
          <p><b>Your balance:</b> {walletBalance} ETH</p>
          <p><b>Contract balance:</b> {contractBalance} ETH</p>
        </>
      )}
      <p>{status}</p>

      <div className="cart-list">
        {cart.length === 0 && <p>Cart is empty</p>}

        {cart.map((product,index)=> (
          <div key={index} className="cart-item">
            <img src={product.imageUrl} />

            <div className="cart-info">
              <h4>{product.name}</h4>
              <p>⭐ {product.rating}</p>
              <p>{product.priceEth} ETH</p>
            </div>

            <div className="cart-actions">
              <button
                className="checkout-button"
                onClick={()=>checkout(product,index)}
              >
                Checkout
              </button>

              <button
                className="remove-button"
                onClick={()=>removeFromCart(index)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}