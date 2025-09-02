import React, { useState } from "react";

const UserPopup = ({ onClose, onSubmit }) => {
  const [email, setEmail] = useState("");
  const [tradeUrl, setTradeUrl] = useState("");

  const handleSubmit = () => {
    onSubmit({ email, tradeUrl });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white text-black p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Complete Your Profile</h2>
        <input
          className="border p-2 w-full mb-4"
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-2 w-full mb-4"
          type="text"
          placeholder="Enter Steam Trade URL"
          value={tradeUrl}
          onChange={(e) => setTradeUrl(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full"   onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default UserPopup;
