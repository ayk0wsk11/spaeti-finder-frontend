import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { AuthContext } from "./auth.context";

const SpaetiContext = createContext();

export const useSpaetiContext = () => {
  const context = useContext(SpaetiContext);
  if (!context) {
    throw new Error("useSpaetiContext must be used within a SpaetiProvider");
  }
  return context;
};

export const SpaetiProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [spaetis, setSpaetis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState([]);

  // Fetch all Spätis from the server
  const fetchSpaetis = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${API_URL}/spaetis`);
      setSpaetis(data.data);
    } catch (err) {
      console.error("Error fetching Spätis:", err);
      setError(err.message || "Failed to fetch Spätis");
    } finally {
      setLoading(false);
    }
  };

  // Fetch user favorites
  const fetchFavorites = async (userId) => {
    if (!userId) {
      setFavoriteIds([]);
      return;
    }
    
    try {
      const token = localStorage.getItem("authToken");
      const { data } = await axios.get(
        `${API_URL}/users/${userId}/favorites`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFavoriteIds(data.data.map(spa => spa._id));
    } catch (err) {
      console.error("Error fetching favorites:", err);
      setFavoriteIds([]);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchSpaetis();
  }, []);

  // Auto-fetch favorites when user changes
  useEffect(() => {
    if (currentUser) {
      fetchFavorites(currentUser._id);
    } else {
      setFavoriteIds([]);
    }
  }, [currentUser]);

  // Helper functions for updating the local state
  const addSpaeti = (newSpaeti) => {
    setSpaetis(prev => [...prev, newSpaeti]);
  };

  const updateSpaeti = (spaetiId, updatedSpaeti) => {
    setSpaetis(prev => 
      prev.map(spaeti => 
        spaeti._id === spaetiId ? { ...spaeti, ...updatedSpaeti } : spaeti
      )
    );
  };

  const deleteSpaeti = (spaetiId) => {
    setSpaetis(prev => prev.filter(spaeti => spaeti._id !== spaetiId));
  };

  // Get a specific Späti by ID (no need for additional API call)
  const getSpaeti = (spaetiId) => {
    return spaetis.find(spaeti => spaeti._id === spaetiId);
  };

  // Get only approved Spätis
  const getApprovedSpaetis = () => {
    return spaetis.filter(spaeti => spaeti.approved);
  };

  // Get unapproved Spätis (for admin)
  const getUnapprovedSpaetis = () => {
    return spaetis.filter(spaeti => !spaeti.approved);
  };

  // Check if a Späti is favorite
  const isFavorite = (spaetiId) => {
    return favoriteIds.includes(spaetiId);
  };

  // Toggle favorite status
  const toggleFavorite = async (spaetiId, userId) => {
    if (!userId) return;
    
    const wasFavorite = isFavorite(spaetiId);
    
    try {
      const token = localStorage.getItem("authToken");
      await axios.patch(
        `${API_URL}/users/${userId}/favorite/${spaetiId}`,
        { add: !wasFavorite },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state
      if (wasFavorite) {
        setFavoriteIds(prev => prev.filter(id => id !== spaetiId));
      } else {
        setFavoriteIds(prev => [...prev, spaetiId]);
      }
      
      return !wasFavorite; // Return new favorite status
    } catch (err) {
      console.error("Error toggling favorite:", err);
      throw err;
    }
  };

  // Refresh data (call this after updates/creates/deletes)
  const refreshSpaetis = () => {
    fetchSpaetis();
  };

  const value = {
    spaetis,
    loading,
    error,
    favoriteIds,
    addSpaeti,
    updateSpaeti,
    deleteSpaeti,
    getSpaeti,
    getApprovedSpaetis,
    getUnapprovedSpaetis,
    refreshSpaetis,
    fetchSpaetis,
    fetchFavorites,
    isFavorite,
    toggleFavorite
  };

  return (
    <SpaetiContext.Provider value={value}>
      {children}
    </SpaetiContext.Provider>
  );
};

export default SpaetiContext;
