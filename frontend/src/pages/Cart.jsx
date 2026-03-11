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


  return (
    <div className="cart-container">
      <Navbar cartCount={cart.length} />
    </div>
  );
}