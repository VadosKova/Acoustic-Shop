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
  const [avatar, setAvatar] = useState("");

  const [account, setAccount] = useState("");
  const [walletBalance, setWalletBalance] = useState("0");

  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editAvatar, setEditAvatar] = useState("");

  const [favorites, setFavorites] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      const u = JSON.parse(savedUser);
      setUser(u);

      setEditName(u.name);
      setEditEmail(u.email);
      setEditAvatar(u.avatarUrl);
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
    if(!name.trim() || !email.trim() || !password.trim()){
      alert("Please fill all fields");
      return;
    }

    const newUser = {
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
      avatarUrl: avatar
    };

    try {
      const res = await API.post("/api/auth/register", newUser);

      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    }catch(err){
      alert("Registration failed");
    }
  }

  async function login() {
    if(!email.trim() || !password.trim()){
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await API.post("/api/auth/login", {
        email: email.trim(),
        password: password.trim()
      });

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

  function disconnectWallet() {
    setAccount("");
    setWalletBalance("0");
  }

  function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp"
    ];

    if(!allowedTypes.includes(file.type)){
      alert("Please upload a valid image (PNG, JPG, JPEG, WEBP)");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  }

  function saveProfile(){
    if(!editName.trim() || !editEmail.trim()){
      alert("Fields cannot be empty");
      return;
    }

    const updatedUser = {
      ...user,
      name: editName.trim(),
      email: editEmail.trim(),
      avatarUrl: editAvatar
    };

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    setEditMode(false);
  }

  function handleEditAvatar(e){
    const file = e.target.files[0];
    if(!file) return;

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp"
    ];

    if(!allowedTypes.includes(file.type)){
      alert("Invalid image format");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setEditAvatar(reader.result);
    };

    reader.readAsDataURL(file);
  }

  useEffect(()=>{
    const fav = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(fav);

    const allOrders = JSON.parse(localStorage.getItem("orders")) || [];

    if(user){
      const userOrders = allOrders.filter(o => o.user === user.email);
      setOrders(userOrders);
    }
  },[user]);

  if (!user) {
    return (
      <div className="profile-container">
        <Navbar />

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
                accept="image/png, image/jpeg, image/webp"
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

      <div className="profile-card">
        {editMode ? (
          <>
            <label htmlFor="editAvatar">
              <img
                src={editAvatar || "https://i.imgur.com/HeIi0wU.png"}
                className="avatar-large clickable"
              />
            </label>

            <input
              id="editAvatar"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleEditAvatar}
              hidden
            />

            <input
              value={editName}
              onChange={(e)=>setEditName(e.target.value)}
            />

            <input
              value={editEmail}
              onChange={(e)=>setEditEmail(e.target.value)}
            />

            <button className="primary-btn" onClick={saveProfile}>
              Save
            </button>

            <button
              className="secondary-btn"
              onClick={()=>setEditMode(false)}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <img
              src={user.avatarUrl || "https://i.imgur.com/HeIi0wU.png"}
              className="avatar-large"
            />

            <h2>{user.name}</h2>

            <div className="profile-info">
              <span>Email</span>
              <p>{user.email}</p>
            </div>

            <button
              className="edit-btn"
              onClick={()=>setEditMode(true)}
            >
              Edit Profile
            </button>
          </>
        )}

        {!account ? (
          <button className="wallet-btn" onClick={connectWallet}>
            Connect Wallet
          </button>
        ) : (
          <button className="wallet-btn disconnect" onClick={disconnectWallet}>
            Disconnect Wallet
          </button>
        )}

        {account && (
          <div className="wallet-box">
            <p><b>Wallet:</b> {account}</p>
            <p><b>Balance:</b> {walletBalance} ETH</p>
          </div>
        )}

        <button className="logout" onClick={logout}>Log out</button>
      </div>

      <div className="profile-section">
        <h3>Обране</h3>

        {favorites.length === 0 ? (
          <p>No choosen yet</p>
        ) : (
          favorites.map((p,i)=>(
            <div key={i} className="fav-item">
              <img src={p.imageUrl}/>
              <p>{p.name}</p>

              <button onClick={()=>{
                const updated = favorites.filter(f => f.id !== p.id);
                localStorage.setItem("favorites", JSON.stringify(updated));
                setFavorites(updated);
              }}>
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      <div className="profile-section">
        <h3>Історія замовлень</h3>

        {orders.length === 0 ? (
          <p>No orders</p>
        ) : (
          orders.map((o,i)=>(
            <div key={i} className="order-item">
              <p><b>Дата:</b> {new Date(o.date).toLocaleString()}</p>

              {o.items.map((item,idx)=>(
                <div key={idx}>
                  {item.name} x {item.quantity}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}