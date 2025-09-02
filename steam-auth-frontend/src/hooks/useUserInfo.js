import { useEffect, useState } from "react";

const useUserInfo = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:4000/api/user", {
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok && data.steamId) {
          setUser(data);

          const profileDone = localStorage.getItem("profileCompleted");
          if (!profileDone || !data.email || !data.tradeUrl) {
            setShowPopup(true);
          }
        } else {
          throw new Error(data?.message || "Failed to fetch user");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { loading, error, showPopup, user };
};

export default useUserInfo;
