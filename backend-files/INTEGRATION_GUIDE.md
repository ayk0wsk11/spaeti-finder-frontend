# Backend Integration Guide for XP System

## Files Created

1. **`xp.routes.js`** - User XP management routes
2. **`approval-xp.routes.js`** - Modified approval routes with XP rewards

## Integration Steps

### 1. Add XP field to User Model

In your User model (usually `models/User.model.js`), add:

```javascript
const userSchema = new Schema({
  // ... existing fields
  xp: {
    type: Number,
    default: 0
  }
  // ... rest of fields
});
```

### 2. Add XP Routes to your Express app

In your main app file (`app.js` or `server.js`):

```javascript
// Import the XP routes
const xpRoutes = require('./routes/xp.routes'); // Adjust path

// Use the routes
app.use('/api/users', xpRoutes); // This will create endpoints like /api/users/:userId/xp
```

### 3. Integrate Approval Routes

**Option A: Replace existing routes**
Replace your current approval routes in `spaetis.routes.js` and `tickets.routes.js` with the ones from `approval-xp.routes.js`.

**Option B: Add as new routes**
Add the routes from `approval-xp.routes.js` to your existing route files:

```javascript
// In your spaetis.routes.js or tickets.routes.js
const express = require('express');
const router = express.Router();

// ... existing routes

// Add the new approval routes from approval-xp.routes.js
// (Copy the router.patch and router.post methods)

module.exports = router;
```

### 4. Update Existing Approval Logic

If you prefer to keep your existing routes, you can integrate XP awarding by:

1. Copy the `awardXPToUser` helper function
2. Copy the `XP_REWARDS` constants
3. Add XP awarding calls to your existing approval logic

Example integration in existing route:
```javascript
router.patch("/approve/:spaetiId", isAuthenticated, async (req, res) => {
  // ... your existing approval logic

  // Add XP awarding after successful approval
  if (spaeti.creator) {
    const xpAmount = spaeti.image ? 50 : 40;
    await awardXPToUser(spaeti.creator._id, xpAmount, "Späti approved");
  }

  // ... rest of response
});
```

## Required Dependencies

Make sure you have these in your `package.json`:
- `express`
- `mongoose` (or your database ORM)
- Your authentication middleware

## Environment Setup

No additional environment variables required, but you may want to add:
```
NODE_ENV=development  # For error details in responses
```

## API Endpoints Created

### XP Management
- `PATCH /api/users/:userId/xp` - Award XP to user
- `GET /api/users/:userId/xp` - Get user's XP info
- `GET /api/users/leaderboard` - Get top users by XP (optional)

### Modified Approval Routes
- `PATCH /api/spaetis/approve/:spaetiId` - Approve Späti (awards XP)
- `POST /api/tickets/:ticketId/approve` - Approve ticket (awards XP)
- `POST /api/ratings` - Create rating (awards XP immediately)

## Testing

Test the XP system with these scenarios:

1. **Create and approve a Späti:**
   ```bash
   # Create Späti (via your existing route)
   # Then approve it
   PATCH /api/spaetis/approve/:spaetiId
   # Should award 40-50 XP to creator
   ```

2. **Create a rating:**
   ```bash
   POST /api/ratings
   # Should immediately award 10 XP
   ```

3. **Submit and approve change request:**
   ```bash
   # Submit ticket (via your existing route)
   # Then approve it
   POST /api/tickets/:ticketId/approve
   # Should award 30 XP to submitter
   ```

4. **Check user XP:**
   ```bash
   GET /api/users/:userId/xp
   # Should show accumulated XP
   ```

## Database Migration

For existing users, run this script to initialize XP:

```javascript
// migration script
const User = require('./models/User.model');

async function initializeUserXP() {
  await User.updateMany(
    { xp: { $exists: false } },
    { $set: { xp: 0 } }
  );
  console.log('XP field initialized for all users');
}

// Run once
initializeUserXP();
```

## Error Handling

The routes include proper error handling and will return:
- 400 for bad requests
- 403 for unauthorized access
- 404 for not found
- 500 for server errors

In development mode, error details are included in responses.
