// src/components/XPDisplay/XPDisplay.jsx
import React from "react";
import { Card, Progress, Badge } from "antd";
import { TrophyOutlined } from "@ant-design/icons";
import { calculateLevel, getXpForNextLevel, getLevelProgress, getLevelBadge } from "../../utils/xpSystem";
import "./XPDisplay.css";

const XPDisplay = ({ user }) => {
  if (!user || user.xp === undefined) {
    return null;
  }

  const currentLevel = calculateLevel(user.xp);
  const xpForNext = getXpForNextLevel(user.xp);
  const progressPercent = getLevelProgress(user.xp);
  const badge = getLevelBadge(currentLevel);

  return (
    <Card className="xp-display-card">
      <div className="xp-header">
        <div className="level-badge">
          <Badge 
            count={currentLevel} 
            style={{ backgroundColor: badge.color }}
            className="level-number"
          />
          <TrophyOutlined className="trophy-icon" style={{ color: badge.color }} />
        </div>
        <div className="level-info">
          <h3 className="level-title">
            <span className="level-icon">{badge.icon}</span>
            {badge.name}
          </h3>
          <p className="xp-text">{user.xp} XP</p>
        </div>
      </div>
      
      <div className="xp-progress">
        <div className="progress-header">
          <span>Level {currentLevel}</span>
          <span>Level {currentLevel + 1}</span>
        </div>
        <Progress 
          percent={progressPercent} 
          strokeColor={badge.color}
          showInfo={false}
          className="level-progress-bar"
        />
        <p className="xp-next-level">
          {xpForNext > 0 ? `${xpForNext} XP until next level` : "Max level reached!"}
        </p>
      </div>
    </Card>
  );
};

export default XPDisplay;
