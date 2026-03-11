import { useState, useEffect } from "react";
import { API } from "../../api/api";
import { ethers } from "ethers";
import Navbar from "../components/Navbar";

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

  async function login() {
    if(!email || !password){
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await API.post("/api/auth/login", { email, password });

      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));

    }catch(err){
      alert("Login failed");
    }
  }

  function logout() {
    setUser(null);
    setAccount("");
    setWalletBalance("0");

    localStorage.removeItem("user");
  }

  function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  }

  if (!user) {
    return (
      <div className="profile-container">
        <nav>
          <ul className="nav-menu">
            <li><Link to="/" className="nav-link">Home</Link></li>
            <li><Link to="/catalog" className="nav-link">Catalog</Link></li>
            <li><Link to="/cart" className="nav-link">Cart</Link></li>
            <li><Link to="/profile" className="nav-link">Profile</Link></li>
          </ul>
        </nav>

        <div className="auth-card">
          <h2 style={{ textAlign: "center" }}>{mode === "register" ? "Register" : "Login"}</h2>

          {mode === "register" && (
            <div className="avatar-upload">

              <label htmlFor="avatarInput">
                {avatar ? (
                  <img
                    src={avatar}
                    className="avatar-preview clickable"
                    alt="Avatar"
                  />
                ) : (
                  <div className="avatar-placeholder clickable">
                    +
                  </div>
                )}
              </label>

              <input
                id="avatarInput"
                type="file"
                onChange={handleAvatarUpload}
                hidden
              />
            </div>
          )}

          {mode === "register" && (
            <input
              placeholder="Name"
              value={name}
              onChange={(e)=>setName(e.target.value)}
            />
          )}

          <input
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

          {mode === "register" && (
            <select
              value={role}
              onChange={(e)=>setRole(e.target.value)}
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          )}

          {mode === "register" ? (
            <>
              <button className="primary-btn" onClick={register}>
                Register
              </button>

              <p style={{textAlign: "center"}}>
                Already have an account?
                <br/><span className="link" onClick={()=>setMode("login")}>
                  Login
                </span>
              </p>
            </>
          ) : (
            <>
              <button className="primary-btn" onClick={login}>Login</button>

              <p style={{textAlign: "center", color: "#555"}}>
                No account?
                <br/><span className="link" onClick={()=>setMode("register")}>
                  Register
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <Navbar />
    </div>
  );
}