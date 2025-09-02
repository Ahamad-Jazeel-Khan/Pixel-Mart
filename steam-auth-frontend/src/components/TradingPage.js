import React, { useState, useMemo, useCallback, useEffect } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import Navbar from "./Navbar";
import Footer from "./Footer";
import useGetInventory from "../hooks/useGetInventory";
import useUserInfo from "../hooks/useUserInfo";
import useGetItemsPrice from "../hooks/useGetItemsPrice";
import useFilteredInventory from "../utils/useFilteredInventory";
import useTradeListing from "../hooks/useTradeListing";
import useGetListedItems from "../hooks/useGetListedItems";

const InventoryItem = React.memo(({ item, selected, onSelect, isLoading, listedItemsSet }) => {
  const { price, loading: priceLoading } = useGetItemsPrice(item?.market_hash_name);

  if (!item || !item.market_hash_name) return null;

  const isListed = listedItemsSet.has(item.id) || listedItemsSet.has(item._id);

  const handleClick = () => {
    if (isListed) {
      toast.warning("This item is already listed for trade", { autoClose: 2000 });
      return;
    }
    onSelect();
  };

  return (
    <div
      onClick={!isLoading ? handleClick : undefined}
      className={`relative bg-[#1a1d24] rounded-xl shadow-md transition-all duration-300 p-2 border cursor-pointer 
        ${selected ? "border-[#3f83f8] scale-105" : "border-transparent hover:border-[#3f83f8] hover:scale-105"}
        ${isListed ? "opacity-40 pointer-events-none" : ""}
        ${isLoading ? "animate-pulse pointer-events-none" : ""}
      `}
    >
      <img
        src={item.image || "/default-item.png"}
        alt={item.market_hash_name}
        className="w-full h-28 object-contain rounded bg-black"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/default-item.png";
        }}
      />
      <div className="mt-2">
        <p className="text-sm font-medium text-gray-100 truncate">{item.market_hash_name}</p>
        {priceLoading ? (
          <div className="h-4 bg-gray-700 rounded animate-pulse mt-1"></div>
        ) : (
          <p className="text-xs text-gray-400 italic">{price?.median_price || "Price unavailable"}</p>
        )}
      </div>

      {isListed && (
        <span className="absolute top-2 left-2 bg-yellow-500 text-black text-[10px] px-2 py-[1px] rounded">
          Listed
        </span>
      )}

      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
});


const TradingPage = () => {
const { user } = useUserInfo();
  const { inventory, loading: inventoryLoading, error: inventoryError, refetch: refetchInventory } = useGetInventory();
  
  // Use the hook's state - remove any local setListedItems usage
  const { listedItems, loading: listedLoading, error: listedError, refetch: refetchListedItems } = useGetListedItems();
  
  const {
    listItemsForTrade,
    removeItemFromTrade,
    bulkRemoveItems,
    loading: tradeLoading,
    error: tradeError,
    success: tradeSuccess,
    reset: resetTradeState,
  } = useTradeListing();

  const [selectedItems, setSelectedItems] = useState([]);
  const [justListed, setJustListed] = useState(false);
  const [removingItems, setRemovingItems] = useState(new Set());
  const [filters, setFilters] = useState({ type: "", exterior: "" });

  const filteredInventory = useFilteredInventory(inventory, filters);
  const listedItemsSet = useMemo(() => new Set(listedItems.map((item) => item.id || item._id)), [listedItems]);

  const isSelected = useCallback(
    (item) => selectedItems.some((i) => i.id === item.id),
    [selectedItems]
  );

  useEffect(() => {
    if (tradeSuccess) {
      const timer = setTimeout(() => {
        resetTradeState();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [tradeSuccess, resetTradeState]);

  const toggleSelect = useCallback(
    (item) => {
      const isAlreadyListed = listedItemsSet.has(item.id) || listedItemsSet.has(item._id);
      if (isAlreadyListed) {
        toast.warning("This item is already listed for trade", { autoClose: 2000 });
        return;
      }

      setSelectedItems((prev) => {
        const alreadySelected = prev.find((i) => i.id === item.id);
        if (alreadySelected) {
          return prev.filter((i) => i.id !== item.id);
        }
        setJustListed(false);
        return [...prev, item];
      });
    },
    [listedItemsSet]
  );

  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  const resetFilters = useCallback(() => setFilters({ type: "", exterior: "" }), []);

  const handleListForTrade = useCallback(async () => {
    if (selectedItems.length === 0) return;

    // Filter out items that are already listed
    const itemsToList = selectedItems.filter(item => 
      !listedItems.some(listedItem => listedItem.id === item.id || listedItem._id === item.id)
    );

    if (itemsToList.length === 0) {
      toast.warning("All selected items are already listed for trade", {
        position: 'top-right',
        autoClose: 3000
      });
      return;
    }

    try {
      const response = await listItemsForTrade(itemsToList);
      
      // Instead of setting local state, refetch from the hook
      await refetchListedItems();
      
      setSelectedItems([]);
      setJustListed(true);
      
      toast.success(`${itemsToList.length} item${itemsToList.length > 1 ? 's' : ''} listed for trade!`, {
        position: 'top-right',
        autoClose: 3000
      });
    } catch (err) {
      if (err.message.includes("already listed")) {
        // If backend still detects duplicates, refetch the actual listed items
        await refetchListedItems();
        
        toast.warning("Some items were already listed. Refreshing your trade list...", {
          position: 'top-right',
          autoClose: 3000
        });
      } else {
        toast.error(`Failed to list items: ${err.message}`, {
          position: 'top-right',
          autoClose: 4000
        });
      }
    }
  }, [listItemsForTrade, selectedItems, listedItems, refetchListedItems]);

  const handleRemoveFromTrade = useCallback(
    async (item) => {
      setRemovingItems((prev) => new Set(prev).add(item._id));
      try {
        await removeItemFromTrade(item._id);
        await refetchListedItems();
        toast.success(`Removed ${item.market_hash_name} from trade`, { autoClose: 2000 });
      } catch (err) {
        toast.error(`Failed to remove item: ${err.message}`, { autoClose: 3000 });
      } finally {
        setRemovingItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(item._id);
          return newSet;
        });
      }
    },
    [removeItemFromTrade, refetchListedItems]
  );

  const handleRemoveAll = useCallback(async () => {
    if (listedItems.length === 0) return;

    try {
      const itemIds = listedItems.map((item) => item._id);
      await bulkRemoveItems(itemIds);
      await refetchListedItems();
      toast.success("All items removed from trade", { autoClose: 3000 });
    } catch (err) {
      toast.error(`Failed to remove items: ${err.message}`, { autoClose: 3000 });
    }
  }, [bulkRemoveItems, listedItems, refetchListedItems]);

  const handleRetryInventory = useCallback(() => refetchInventory(), [refetchInventory]);

  if (inventoryLoading) {
    return (
      <div className="flex min-h-screen justify-center items-center bg-[#0f1116]">
        <img className="w-32" src="/tube-spinner.svg" alt="Loading..." />
      </div>
    );
  }

  if (inventoryError) {
    return (
      <div className="flex min-h-screen justify-center items-center bg-[#0f1116] flex-col gap-4">
        <p className="text-red-400 text-lg">Error loading inventory: {inventoryError}</p>
        <button onClick={handleRetryInventory} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <ToastContainer theme="dark" transition={Bounce} />
      <Navbar user={user} />

      <section className="bg-[#0f1116] text-white pt-24 px-6 pb-4 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Filters + Inventory */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#1a1d24] p-4 rounded-xl shadow">
              <h3 className="text-sm font-bold mb-2 text-gray-300">Filters</h3>
              <div className="space-y-2">
                <select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="w-full p-2 rounded bg-[#0f1116] text-white border border-gray-600"
                >
                  <option value="">All Types</option>
                  <option value="Rifle">Rifles</option>
                  <option value="Sniper Rifle">Snipers</option>
                  <option value="Pistol">Pistols</option>
                  <option value="SMG">SMGs</option>
                  <option value="Shotgun">Shotguns</option>
                  <option value="Sticker">Stickers</option>
                  <option value="Case">Cases</option>
                  <option value="Graffiti">Graffiti</option>
                  <option value="Agent">Agents</option>
                  <option value="Music Kit">Music Kits</option>
                </select>

                <select
                  name="exterior"
                  value={filters.exterior}
                  onChange={handleFilterChange}
                  className="w-full p-2 rounded bg-[#0f1116] text-white border border-gray-600"
                >
                  <option value="">All Exteriors</option>
                  <option value="Factory New">Factory New</option>
                  <option value="Minimal Wear">Minimal Wear</option>
                  <option value="Field-Tested">Field-Tested</option>
                  <option value="Well-Worn">Well-Worn</option>
                  <option value="Battle-Scarred">Battle-Scarred</option>
                </select>

                <button className="px-2 text-gray-400 hover:text-white transition-colors" onClick={resetFilters}>
                  Reset Filters
                </button>
              </div>
            </div>

            <div className="bg-[#1a1d24] p-4 rounded-xl shadow max-h-[75vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-bold text-gray-300">Your Inventory</h3>
                {selectedItems.length > 0 && (
                  <span className="text-xs text-gray-400">{selectedItems.length} selected</span>
                )}
              </div>

              {filteredInventory.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {filteredInventory.map((item) => (
                    <InventoryItem
                      key={item.id}
                      item={item}
                      selected={isSelected(item)}
                      onSelect={() => toggleSelect(item)}
                      listedItemsSet={listedItemsSet}
                      isLoading={removingItems.has(item._id)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  {inventory.length === 0 ? "Your inventory is empty" : "No items match your filters"}
                </p>
              )}
            </div>
          </div>

          {/* Right: Listed Items */}
          <div className="lg:col-span-7">
            <div className="bg-[#1a1d24] p-4 rounded-xl shadow max-h-[88vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-gray-300">Your Trade Offer</h3>
                {listedItems.length > 0 && (
                  <button
                    onClick={handleRemoveAll}
                    disabled={tradeLoading}
                    className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
                  >
                    Remove All
                  </button>
                )}
              </div>

              {listedItems.length === 0 && selectedItems.length === 0 ? (
                <div className="border border-dashed border-gray-600 p-8 text-center text-gray-500 rounded-lg">
                  <div className="text-4xl mb-2">🎮</div>
                  <p className="text-sm">Select items from your inventory to start trading</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                    {listedItems.map((item) => (
                      <div
                        key={item._id}
                        className="bg-[#0f1116] border border-gray-700 p-2 rounded text-center relative"
                      >
                        {removingItems.has(item._id) && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 rounded flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                        <img
                          src={item.image || "/default-item.png"}
                          alt={item.market_hash_name}
                          className="h-20 mx-auto mb-2 bg-black rounded"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/default-item.png";
                          }}
                        />
                        <p className="text-xs text-gray-300 truncate">{item.market_hash_name}</p>
                        <button
                          onClick={() => handleRemoveFromTrade(item)}
                          disabled={removingItems.has(item._id)}
                          className="mt-2 text-red-400 text-xs hover:underline disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleListForTrade}
                      disabled={tradeLoading || selectedItems.length === 0}
                      className={`px-4 py-2 rounded text-white font-semibold flex-1 transition-colors
                        ${tradeLoading || selectedItems.length === 0
                          ? "bg-gray-600 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"}
                      `}
                    >
                      {tradeLoading ? (
                        <span className="flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Processing...
                        </span>
                      ) : (
                        `List ${selectedItems.length} Item${selectedItems.length !== 1 ? "s" : ""} for Trade`
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default TradingPage;
