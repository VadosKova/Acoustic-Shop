import { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function Cart() {
  const [cart,setCart] = useState([]);

  const [account,setAccount] = useState("");
  const [walletBalance,setWalletBalance] = useState("0");
  const [contractBalance,setContractBalance] = useState("0");

  const [status,setStatus] = useState("");

  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

  useEffect(()=>{
    const savedCart = localStorage.getItem("cart");

    if(savedCart){
      setCart(JSON.parse(savedCart));
    }
  },[]);


  return (
    <div className="cart-container">
      <Navbar cartCount={cart.length} />
    </div>
  );
}