// src/components/XPNotification/XPNotification.jsx
import React from "react";
import { notification } from "antd";
import { TrophyOutlined } from "@ant-design/icons";
import { calculateLevel, getLevelBadge } from "../../utils/xpSystem";

// Function to show XP gain notification
export const showXPNotification = (xpGained, newTotalXP, reason) => {
  const currentLevel = calculateLevel(newTotalXP);
  const previousLevel = calculateLevel(newTotalXP - xpGained);
  const badge = getLevelBadge(currentLevel);
  
  const isLevelUp = currentLevel > previousLevel;
  
  notification.success({
    message: isLevelUp ? "🎉 Level Up!" : "XP Gained!",
    description: isLevelUp 
      ? `Congratulations! You reached ${badge.icon} ${badge.name} (Level ${currentLevel}). +${xpGained} XP for ${reason}`
      : `+${xpGained} XP for ${reason}. Total: ${newTotalXP} XP`,
    icon: <TrophyOutlined style={{ color: badge.color }} />,
    duration: isLevelUp ? 6 : 4,
    placement: "topRight",
    style: {
      backgroundColor: isLevelUp ? '#f6ffed' : undefined,
      border: isLevelUp ? `2px solid ${badge.color}` : undefined,
    }
  });
};

// Component for in-app XP display (could be used in navbar)
const XPNotification = ({ user, compact = false }) => {
  if (!user || user.xp === undefined) return null;
  
  const level = calculateLevel(user.xp);
  const badge = getLevelBadge(level);
  
  if (compact) {
    return (
      <div className="xp-compact">
        <span className="level-icon">{badge.icon}</span>
        <span className="level-text">Lv.{level}</span>
        <span className="xp-text">{user.xp}XP</span>
      </div>
    );
  }
  
  return (
    <div className="xp-notification">
      <TrophyOutlined style={{ color: badge.color }} />
      <span>{badge.icon} Level {level}</span>
      <span>{user.xp} XP</span>
    </div>
  );
};

export default XPNotification;
