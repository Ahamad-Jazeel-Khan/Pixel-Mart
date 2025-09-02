// main.jsx or index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // ✅ this line must be here
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TradingPage from './components/TradingPage';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    
    <BrowserRouter>
     <Routes>
      <Route path="/" element={<App />} />
      <Route path="/TradingPage" element={<TradingPage />} />
    </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
