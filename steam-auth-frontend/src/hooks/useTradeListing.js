// hooks/useTradeListing.js
import { useState, useCallback } from "react";

const useTradeListing = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

  const listItemsForTrade = useCallback(async (items, onSuccess) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Validate items before sending
      if (!items || !Array.isArray(items) || items.length === 0) {
        throw new Error("No items provided for trade");
      }

      const invalidItems = items.filter(item => 
        !item || !item.id || !item.market_hash_name
      );
      
      if (invalidItems.length > 0) {
        throw new Error("Some items are missing required fields");
      }

      const res = await fetch(`${API_BASE_URL}/trade/list`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ items }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || `HTTP error! status: ${res.status}`);
      }

      setSuccess(true);
      onSuccess?.(data);
      return data;

    } catch (err) {
      console.error("Failed to list items:", err.message);
      const errorMessage = err.message || "Failed to list items for trade";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  const removeItemFromTrade = useCallback(async (id, onSuccess) => {
  setLoading(true);
  setError(null);
  setSuccess(false);
  
  try {
    if (!id) {
      throw new Error("No item ID provided");
    }

    const res = await fetch(`${API_BASE_URL}/trade/remove/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.message || `HTTP error! status: ${res.status}`);
    }

    setSuccess(true);
    onSuccess?.(data);
    return data;

  } catch (err) {
    console.error("Failed to remove item:", err.message);
    const errorMessage = err.message || "Failed to remove item from trade";
    setError(errorMessage);
    throw new Error(errorMessage);
  } finally {
    setLoading(false);
  }
}, [API_BASE_URL]);

  const bulkRemoveItems = useCallback(async (itemIds, onSuccess) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
        throw new Error("No item IDs provided");
      }

      const res = await fetch(`${API_BASE_URL}/trade/bulk-remove`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ itemIds }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || `HTTP error! status: ${res.status}`);
      }

      setSuccess(true);
      onSuccess?.(data);
      return data;

    } catch (err) {
      console.error("Failed to bulk remove items:", err.message);
      const errorMessage = err.message || "Failed to remove items from trade";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  const retry = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  return { 
    listItemsForTrade, 
    removeItemFromTrade, 
    bulkRemoveItems,
    loading, 
    error, 
    success,
    retry,
    reset
  };
};

export default useTradeListing;