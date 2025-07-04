# XP System Implementation Guide for SpaetiFinder

## Overview
This document describes the complete XP (Experience Points) system implementation for the SpaetiFinder app, including frontend components, backend routes, and integration points.

## XP Rewards Structure

### XP Rewards for Actions
- **Create Späti with image (approved)**: 50 XP
- **Create Späti without image (approved)**: 40 XP  
- **Update Späti (approved)**: 30 XP
- **Leave a rating**: 10 XP

### Level System
- **Level 1**: 0 XP (starting level)
- **Level 2**: 100 XP total (100 XP to advance)
- **Level 3**: 300 XP total (200 XP to advance from Level 2)
- **Level 4**: 600 XP total (300 XP to advance from Level 3)
- **Level N**: Requires (N-1) * 100 additional XP from previous level

### Level Badges
1. **Späti Newbie** 🌱 (Level 1)
2. **Corner Explorer** 🗺️ (Level 2)
3. **Sterni Specialist** 🍺 (Level 3)
4. **Neighborhood Expert** 🏪 (Level 4)
5. **Späti Connoisseur** ⭐ (Level 5)
6. **Berlin Native** 🏆 (Level 6)
7. **Späti Legend** 👑 (Level 7)
8. **Ultimate Guide** 💎 (Level 8)
9. **Späti Master N** 🌟 (Level 9+)

## Frontend Implementation

### Files Created/Modified

#### New Files
1. `/src/utils/xpSystem.js` - Core XP calculation utilities
2. `/src/components/XPDisplay/XPDisplay.jsx` - Profile page XP display component
3. `/src/components/XPDisplay/XPDisplay.css` - Styling for XP display
4. `/src/components/XPNotification/XPNotification.jsx` - XP notification system

#### Modified Files
1. `/src/pages/UserProfilePage/UserProfilePage.jsx` - Added XP display
2. `/src/pages/SpaetiCreatePage/SpaetiCreatePage.jsx` - XP rewards for creation
3. `/src/components/CreateRating/CreateRatingComp.jsx` - XP rewards for ratings
4. `/src/components/ChangeRequestForm/ChangeRequestForm.jsx` - Added XP imports
5. `/src/pages/ApprovalPage/ApprovalPage.jsx` - XP feedback on approvals
6. `/src/context/auth.context.jsx` - Added refreshUser method

### Key Functions

#### XP Calculation (`xpSystem.js`)
- `calculateLevel(xp)` - Returns user level based on total XP
- `getXpForNextLevel(currentXp)` - XP needed for next level
- `getLevelProgress(currentXp)` - Progress percentage for current level
- `getLevelBadge(level)` - Returns badge info for level
- `awardXP(userId, amount, reason, callback)` - Awards XP to user

#### XP Display Component
- Shows current level with badge icon and color
- Progress bar toward next level
- XP amount and level name
- Mobile-responsive design with dark mode support

## Backend Implementation

### Required Backend Routes

#### User XP Management Routes
```javascript
// Award XP to user
PATCH /users/:userId/xp
Body: { xpToAdd: number, reason: string }

// Get user XP information  
GET /users/:userId/xp
Returns: { userId, username, xp }
```

#### Modified Approval Routes
```javascript
// Approve Späti (awards XP to creator)
PATCH /spaetis/approve/:spaetiId
Returns: { spaeti, xpAwarded, creator }

// Approve ticket/change request (awards XP to submitter)
PATCH /tickets/approve/:ticketId  
Returns: { ticket, xpAwarded, user }
```

### Database Schema
Ensure your User model includes:
```javascript
{
  xp: {
    type: Number,
    default: 0
  }
  // ... other fields
}
```

## Integration Points

### XP Award Triggers

1. **Späti Creation**: XP awarded when admin approves new Späti
   - Triggered in approval process, not on submission
   - Amount depends on whether image was uploaded

2. **Rating Creation**: XP awarded immediately when rating is submitted
   - 10 XP per rating
   - Instant feedback to user

3. **Späti Updates**: XP awarded when admin approves change request
   - 30 XP for approved updates
   - Triggered in ticket approval process

### User Experience Flow

1. **User performs action** → 
2. **XP awarded (if applicable)** → 
3. **User context refreshed** → 
4. **Success message with XP amount** → 
5. **Profile page shows updated XP/level**

## Usage Examples

### Awarding XP in Components
```javascript
import { awardXP, XP_REWARDS } from '../../utils/xpSystem';

// Award XP with user context refresh
await awardXP(
  currentUser._id, 
  XP_REWARDS.CREATE_RATING, 
  "Created a rating", 
  authenticateUser
);
```

### Displaying XP Information
```javascript
import XPDisplay from '../../components/XPDisplay/XPDisplay';

// In profile page
<XPDisplay user={user} />
```

### Calculating Levels
```javascript
import { calculateLevel, getLevelBadge } from '../../utils/xpSystem';

const level = calculateLevel(user.xp);
const badge = getLevelBadge(level);
```

## Testing

### Test Scenarios
1. Create new Späti → Submit for approval → Admin approves → User receives XP
2. Leave rating → Immediate XP reward
3. Submit change request → Admin approves → User receives XP  
4. Check profile page displays correct level and progress
5. Verify level transitions work correctly

### Backend Testing
1. Test XP routes with various scenarios
2. Verify XP accumulation in database
3. Test approval workflows award correct XP amounts

## Deployment Notes

1. **Database Migration**: Ensure existing users have xp field initialized to 0
2. **Backend Routes**: Add the new XP routes to your API
3. **Environment**: Test XP calculations with various amounts
4. **Performance**: XP calculations are lightweight and run client-side

## Future Enhancements

1. **Leaderboards**: Display top users by XP/level
2. **Achievements**: Additional badges for specific milestones
3. **XP History**: Track XP gain history for users
4. **Multipliers**: Special events with bonus XP
5. **Level Rewards**: Unlock features at certain levels

## Troubleshooting

### Common Issues
1. **XP not updating**: Check if backend XP routes are properly implemented
2. **Level calculation wrong**: Verify XP calculation logic matches specification
3. **Profile not refreshing**: Ensure `authenticateUser` callback is working
4. **Missing XP display**: Check if user object contains `xp` field

### Debug Tips
- Use browser console to check XP calculation functions
- Verify API calls return expected XP data
- Check if user context is being refreshed after XP awards
