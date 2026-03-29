import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../api/api";
import { ethers } from "ethers";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";

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

  const navigate = useNavigate();

  useEffect(() => {
    const savedWallet = localStorage.getItem("wallet");
    const savedBalance = localStorage.getItem("walletBalance");

    if (savedWallet) {
      setAccount(savedWallet);
    }

    if (savedBalance) {
      setWalletBalance(savedBalance);
    }
  }, []);

  const removeFromFavorites = async (productId) => {
    if (!user) return;

    try {
      await API.delete(`/api/auth/favorite/${user.id}/${productId}`);
    } catch (err) {
      console.error(err);
    }

    setFavorites(prev => prev.filter(p => p.id !== productId));
  };

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
    const user = JSON.parse(localStorage.getItem("user"));

    if(!user){
      alert("You need to Sign In");
      return;
    }

    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);

    setAccount(accounts[0]);

    localStorage.setItem("wallet", accounts[0]);
  }

  async function loadWalletBalance() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const balance = await provider.getBalance(account);
    setWalletBalance(ethers.formatEther(balance));
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePassword(password) {
    if (password.length < 6)
      return "At least 6 characters";

    if (!/\d/.test(password))
      return "At least one digit";

    return "";
  }

  async function register() {
    if(!name.trim() || !email.trim() || !password.trim()){
      alert("Please fill all fields");
      return;
    }

    if(!isValidEmail(email)){
      alert("Invalid email format");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      alert(passwordError);
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

    if(!isValidEmail(email)){
      alert("Invalid email format");
      return;
    }

    try {
      const res = await API.post("/api/auth/login", {
        email: email.trim(),
        password: password.trim()
      });

      const normalizedUser = {
        ...res.data,
        id: res.data.id || res.data._id
      };

      setUser(normalizedUser);
      localStorage.setItem("user", JSON.stringify(normalizedUser));

      if (res.data.email === "admin@gmail.com") {
        navigate("/admin-panel");
      }

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

    localStorage.removeItem("wallet");
  }

  function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg"
    ];

    if(!allowedTypes.includes(file.type)){
      alert("Please upload a valid image (PNG, JPG, JPEG)");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  }

  async function saveProfile(){
    if(!editName.trim() || !editEmail.trim()){
      alert("Fields cannot be empty");
      return;
    }

    if(!isValidEmail(editEmail)){
      alert("Invalid email format");
      return;
    }

    const updatedUser = {
      ...user,
      name: editName.trim(),
      email: editEmail.trim(),
      avatarUrl: editAvatar
    };

    try {
      await API.put(`/api/auth/${user.id}`, updatedUser); 

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setEditMode(false);
      alert("Profile updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to save profile");
    }
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
    if (!user) return;

    async function loadFavorites() {
      try {
        const res = await API.get(`/api/auth/${user.id}`);
        const favIds = res.data.favoriteProductIds || [];

        const productsRes = await API.get("/api/products");

        const favProducts = productsRes.data.filter(p => {
          const productId = p.id || p._id;
          return favIds.includes(productId);
        });

        setFavorites(favProducts);
      } catch (err) {
        console.error(err);
      }
    }

    loadFavorites();

    async function loadOrders() {
      try {
        const res = await API.get(`/api/orders/user/${user.email}`);
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      }
    }

    loadOrders();
  }, [user]);

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
          <div className="wallet-box" style={{
            marginTop: 10,
            display: "flex",
            flexDirection: "column",
            gap: 6
          }}>
            <div><b>Wallet:</b></div>
            <div style={{
              fontSize: 12,
              background: "#fff",
              padding: "6px 8px",
              borderRadius: 6,
              border: "1px solid #eee"
            }}>
              {account}
            </div>

            <div style={{ marginTop: 6 }}>
              <b>Balance:</b>{" "}
              <span style={{
                color: "#42b883",
                fontWeight: "600"
              }}>
                {parseFloat(walletBalance).toFixed(4)} ETH
              </span>
            </div>
          </div>
        )}

        <button className="logout" onClick={logout}>Log out</button>
      </div>
      
      {user?.email !== "admin@gmail.com" && (
        <div className="profile-section">
          <h3>Обране</h3>

          {favorites.length === 0 ? (
            <p>No choosen yet</p>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 20,
              marginTop: 20,
              marginLeft: 20
            }}>
              {favorites.map((p, i) => (
                <ProductCard
                  key={p.id || i}
                  product={p}
                  hideFavorite={false}
                  isAdmin={user?.email === "admin@gmail.com"}
                  onFavoriteToggle={() => removeFromFavorites(p.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {user?.email !== "admin@gmail.com" && (
        <div className="profile-section">
          <h3>Історія замовлень</h3>

          {orders.length === 0 ? (
            <p>No orders</p>
          ) : (
            <div className="orders-list" style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%", maxWidth: 800, marginTop: 20 }}>
              {orders.map((o,i)=>(
                <div key={i} className="order-item" style={{ position: "relative", border: "1px solid #eee", borderRadius: 12, padding: "20px", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                  <div style={{
                    position: "absolute",
                    top: 15,
                    right: 15,
                    padding: "5px 12px",
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: "bold",
                    color: "#fff",
                    background:
                      o.status === "Accepted"
                        ? "green"
                        : o.status === "Rejected"
                        ? "red"
                        : "#f5a623"
                  }}>
                    {o.status}
                  </div>
                  <p style={{ marginBottom: 15, fontSize: 14, color: "#666" }}>
                    <b>Дата:</b> {o.date ? new Date(o.date).toLocaleString() : "Не вказана"}
                  </p>
                  
                  <div className="order-products" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {o.items.map((item,idx)=>(
                      <div key={idx} style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: 15, 
                        padding: "10px 0",
                        borderTop: "1px solid #f9f9f9" 
                      }}>
                        <img 
                          src={item.ImageUrl || item.imageUrl || "https://via.placeholder.com/50"} 
                          alt={item.name} 
                          style={{ width: 60, height: 60, objectFit: "contain", borderRadius: 6, border: "1px solid #eee" }}
                        />
                        <div style={{ flexGrow: 1 }}>
                          <div style={{ fontWeight: "600", fontSize: 15 }}>{item.name}</div>
                          <div style={{ fontSize: 13, color: "#888" }}>Кількість: {item.quantity} шт.</div>
                        </div>
                        <div style={{ fontWeight: "bold", color: "#333" }}>
                          {item.priceEth || item.PriceEth} ETH
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            }</div>
            )}
        </div>
      )}
    </div>
  );
}