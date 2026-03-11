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

  return (
    <div className="profile-container">
      
    </div>
  );
}