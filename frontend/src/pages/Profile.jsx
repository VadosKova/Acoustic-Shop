import { useState, useEffect } from "react";
import { API } from "../../api/api";
import { ethers } from "ethers";
import { Link } from "react-router-dom";

export default function Profile() {
  const [mode, setMode] = useState("register");
  const [user, setUser] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");
  const [avatar, setAvatar] = useState("");

  const [account, setAccount] = useState("");
  const [walletBalance, setWalletBalance] = useState("0");


  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
        setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (account) {
      loadWalletBalance();
    }
  }, [account]);

  async function connectWallet() {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    setAccount(accounts[0]);
  }

  async function loadWalletBalance() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const balance = await provider.getBalance(account);
    setWalletBalance(ethers.formatEther(balance));
  }

  async function register() {
    if(!name || !email || !password){
      alert("Please fill all fields");
      return;
    }

    const newUser = { name, email, password, role, avatarUrl: avatar };
    try {
      const res = await API.post("/api/auth/register", newUser);

      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    }catch(err){
      alert("Registration failed");
    }
  }

  return (
    <div className="profile-container">
      
    </div>
  );
}