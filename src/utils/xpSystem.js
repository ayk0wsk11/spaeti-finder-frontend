// src/utils/xpSystem.js
import axios from "axios";
import { API_URL } from "../config";

// XP rewards for different actions
export const XP_REWARDS = {
  CREATE_SPAETI_WITH_IMAGE: 50,
  CREATE_SPAETI_WITHOUT_IMAGE: 40,
  UPDATE_SPAETI: 30,
  CREATE_RATING: 10,
};

// Calculate level from XP
export const calculateLevel = (xp) => {
  if (xp < 0) return 1;
  
  // Level 1 = 0xp, Level 2 = 100xp, Level 3 = 300xp (100+200), Level 4 = 600xp (100+200+300)
  let level = 1;
  let totalXpNeeded = 0;
  
  while (totalXpNeeded <= xp) {
    const xpForNextLevel = level * 100; // Level 2 needs 100, Level 3 needs 200, etc.
    totalXpNeeded += xpForNextLevel;
    if (totalXpNeeded <= xp) {
      level++;
    }
  }
  
  return level;
};

// Calculate XP needed for next level
export const getXpForNextLevel = (currentXp) => {
  const currentLevel = calculateLevel(currentXp);
  const xpForNextLevel = currentLevel * 100;
  
  // Calculate total XP needed to reach next level
  let totalXpForCurrentLevel = 0;
  for (let i = 1; i < currentLevel; i++) {
    totalXpForCurrentLevel += i * 100;
  }
  
  const xpNeeded = totalXpForCurrentLevel + xpForNextLevel - currentXp;
  return Math.max(0, xpNeeded);
};

// Get XP progress for current level (0-100%)
export const getLevelProgress = (currentXp) => {
  const currentLevel = calculateLevel(currentXp);
  
  // Calculate XP range for current level
  let totalXpForPreviousLevel = 0;
  for (let i = 1; i < currentLevel; i++) {
    totalXpForPreviousLevel += i * 100;
  }
  
  const xpForCurrentLevel = currentLevel * 100;
  const xpInCurrentLevel = currentXp - totalXpForPreviousLevel;
  
  if (xpForCurrentLevel === 0) return 100;
  return Math.min(100, (xpInCurrentLevel / xpForCurrentLevel) * 100);
};

// Award XP to a user with enhanced notification support
export const awardXP = async (userId, xpAmount, reason = "", refreshUserCallback = null, showNotification = false) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.patch(
      `${API_URL}/users/${userId}/xp`,
      { 
        xpToAdd: xpAmount,
        reason: reason 
      },
      { 
        headers: { Authorization: `Bearer ${token}` } 
      }
    );
    
    // If a refresh callback is provided, call it to update user context
    if (refreshUserCallback && typeof refreshUserCallback === 'function') {
      try {
        await refreshUserCallback();
      } catch (refreshError) {
        console.warn("Could not refresh user data after XP award:", refreshError);
      }
    }
    
    // Show notification if requested and we have the notification system available
    if (showNotification && response.data?.data?.newXP) {
      try {
        const { showXPNotification } = await import('../components/XPNotification/XPNotification');
        showXPNotification(xpAmount, response.data.data.newXP, reason);
      } catch (notificationError) {
        console.warn("Could not show XP notification:", notificationError);
      }
    }
    
    return response.data;
  } catch (error) {
    console.error("Error awarding XP:", error);
    throw error;
  }
};

// Get level badges/names (you can customize these later)
export const getLevelBadge = (level) => {
  const badges = {
    1: { name: "Späti Newbie", icon: "🌱", color: "#52c41a" },
    2: { name: "Corner Explorer", icon: "🗺️", color: "#1890ff" },
    3: { name: "Sterni Specialist", icon: "🍺", color: "#fa8c16" },
    4: { name: "Neighborhood Expert", icon: "🏪", color: "#eb2f96" },
    5: { name: "Späti Connoisseur", icon: "⭐", color: "#722ed1" },
    6: { name: "Berlin Native", icon: "🏆", color: "#f5222d" },
    7: { name: "Späti Legend", icon: "👑", color: "#faad14" },
    8: { name: "Ultimate Guide", icon: "💎", color: "#13c2c2" },
  };
  
  if (level <= 8) {
    return badges[level];
  }
  
  // For levels above 8, create dynamic badges
  return {
    name: `Späti Master ${level}`,
    icon: "🌟",
    color: "#001529"
  };
};
