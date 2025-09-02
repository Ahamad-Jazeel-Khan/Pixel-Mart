import { useState, useEffect } from 'react';

const useGetItemsPrice = (marketHashName) => {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!marketHashName) return;

    const fetchPrice = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:4000/api/price/${encodeURIComponent(marketHashName)}`
        );
        const data = await res.json();
        console.log("📦 Price data received:", data);

        // ❌ Check for price fetch failure from your backend
        if (!res.ok || data.success === false) {
          throw new Error(data.message || "Failed to fetch price");
        }

        setPrice(data);
        setError(null);
      } catch (err) {
        console.error("❌ Error fetching price:", err);
        setError(err.message || "Unknown error");
        setPrice(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
  }, [marketHashName]);

  return { price, loading, error };
};

export default useGetItemsPrice;
