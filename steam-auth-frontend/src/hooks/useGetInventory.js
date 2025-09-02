import { useEffect, useState } from "react";

const useGetInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getInventory = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/steam-inventory", {
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok || data.message) {
          throw new Error(data.message || "Failed to fetch inventory");
        }

        setInventory(data);

        
        
      } catch (error) {
        console.error("Error fetching inventory:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getInventory();
  }, []);

  return { inventory, loading, error };
};

export default useGetInventory;
