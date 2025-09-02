// components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ user }) => {
  const handleLogin = () => {
    window.location.href = "http://localhost:4000/auth/steam";
  };

  const handleLogout = async () => {
    await fetch("http://localhost:4000/auth/logout", {
      credentials: "include",
    });

    localStorage.removeItem("profileCompleted");
    window.location.reload();
  };

  return (
    <nav className="fixed top-0 w-full bg-black/30 backdrop-blur-md text-white p-4 flex justify-between items-center z-50 shadow-md">
      <div className="gap-10 flex items-center">
        <video
          src="pixelogo.mp4"
          autoPlay
          loop
          muted
          className="w-10 h-10 rounded-full"
        />
        <Link to="/" >
          <img src="pm.png" className="h-10 " alt="" />
        </Link>
        <div className="gap-5 flex items-center">
          <Link to="/Marketplacepage" className="font-semibold hover:text-gray-300 transition">
            Market
          </Link>
          <Link to="/Tradingpage" className="font-semibold hover:text-gray-300 transition">
            Trading
          </Link>
        </div>
      </div>

      {user ? (
        <div className="flex items-center gap-4">
          <img
            src={user.avatar}
            alt="Avatar"
            className="w-10 h-10 rounded-full border border-gray-400"
          />
          <span className="font-medium">{user.username}</span>
          <button
            onClick={handleLogout}
            className="bg-white/90 text-black px-4 py-1 rounded-md shadow hover:bg-white transition"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={handleLogin}
          className="bg-white/90 text-black px-4 py-1 rounded-md shadow hover:bg-white transition"
        >
          Sign in with Steam
        </button>
      )}
    </nav>
  );
};

export default Navbar;
