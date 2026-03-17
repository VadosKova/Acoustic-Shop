import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Navbar from "../components/Navbar";

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

  useEffect(()=>{
    if(account){
      loadWalletBalance(account);
      loadContractBalance();
    }
  },[account]);


  async function connectWallet(){
    if(!window.ethereum){
      alert("Install MetaMask");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts",[]);

    setAccount(accounts[0]);
  }

  async function loadWalletBalance(account){
    const provider = new ethers.BrowserProvider(window.ethereum);
    const balance = await provider.getBalance(account);

    setWalletBalance(ethers.formatEther(balance));
  }

  async function loadContractBalance(){
    if(!contractAddress) return;

    const provider = new ethers.BrowserProvider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);

    setContractBalance(ethers.formatEther(balance));
  }

  async function checkout(product,index){
    try {
      if(!account){
        alert("Connect MetaMask");
        return;
      }

      setStatus("Waiting for confirmation...");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tx = await signer.sendTransaction({
        to: contractAddress,
        value: ethers.parseEther(product.priceEth.toString())
      });

      await tx.wait();

      setStatus("Payment successful");

      removeFromCart(index);

      loadWalletBalance(account);
      loadContractBalance();
    } catch(err){
      console.error(err);
      setStatus("Payment failed");
    }
  }

  function removeFromCart(index){
    const updated = cart.filter((_,i)=> i !== index);

    setCart(updated);
    localStorage.setItem("cart",JSON.stringify(updated));
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