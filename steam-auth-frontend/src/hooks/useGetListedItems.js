import { useState, useEffect } from 'react';

const useGetListedItems = () => {
  const [listedItems, setListedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

  const fetchListedItems = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/trade/my-items`, {
        credentials: "include",
      });
      
      if (!res.ok) throw new Error('Failed to fetch listed items');
      
      const data = await res.json();
      setListedItems(data.items || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching listed items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListedItems();
  }, []);

  // 🔥 renamed refetch → refetchListedItems
  return { listedItems, loading, error, refetchListedItems: fetchListedItems };
};

export default useGetListedItems;
