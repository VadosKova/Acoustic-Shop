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

  function renderStars(rating = 0) {
    const fullStars = Math.round(rating);
    return "★".repeat(fullStars) + "☆".repeat(5 - fullStars);
  }

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
      <Navbar cartCount={cart.length}/>

      <h2>Shopping Cart</h2>

      <div className="cart-list">
        {cart.length === 0 && <p>Cart is empty</p>}

        {cart.map((product,index)=> (
          <div key={index} className="cart-item">
            <img src={product.imageUrl} />

            <div className="cart-info">
              <h4>{product.name}</h4>
              <span style={{ color: "#f5a623", fontSize: 20 }}>
                {renderStars(product.rating)}
              </span>
              <p>{product.priceEth} ETH</p>

              <div className="quantity-box">
                <button
                  disabled={product.quantity === 1}
                  onClick={()=>updateQuantity(index,-1)}
                >-</button>

                <span>{product.quantity}</span>

                <button onClick={()=>updateQuantity(index,1)}>+</button>
              </div>
            </div>

            <div className="cart-actions">
              <button
                className="remove-button"
                onClick={()=>removeFromCart(index)}
              >
                Remove
              </button>
              {cart.length > 0 && (
                <button className="checkout-btn" onClick={checkout}>
                  Оформити замовлення
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}