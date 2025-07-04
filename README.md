# 🏪 Spätify - Berlin's Ultimate Späti Finder

**[🚀 Live Demo](https://spaetify.netlify.app/)** | **[📱 Try it now!](https://spaetify.netlify.app/)**

---

## 📖 Description

Welcome to **Spätify**! 🎉

We are Ayko and Jonathan, two passionate web developers who created this project as our **final capstone** for the Ironhack Web Development Bootcamp. 

**Spätify** helps Berlin residents and visitors easily discover, rate, and find the best **Spätis** (late-night convenience stores) throughout the city. Whether you need a cold beer at 2 AM or forgot to buy groceries, we've got you covered! 🍺🥨

![Homepage Screenshot](./screenshots/homepage.png)
*Interactive map showing all Spätis in Berlin*

---

## ✨ Key Features

### 🗺️ **Interactive Map**
- **Real-time Späti locations** with custom markers
- **Click markers** to see Späti details instantly
- **Responsive design** for mobile and desktop

![Map Feature](./screenshots/map-feature.png)

### ⭐ **Rating & Review System**
- **5-star rating system** for each Späti
- **Detailed comments** from the community
- **Like/Unlike reviews** from other users
- **Average rating calculation** displayed on cards

### 🏆 **XP & Level System** (NEW!)
- **Earn XP points** for contributing to the community:
  - 🏪 **Create a Späti**: 50 XP (with image) / 40 XP (without image)
  - 📝 **Submit updates**: 30 XP (when approved)
  - ⭐ **Leave a rating**: 10 XP
- **Level progression**: Every 100 XP = 1 Level
- **XP tracking** on your profile page

![User Profile](./screenshots/user-profile.png)
*User profile showing XP, level, and rating history*

### 🔍 **Advanced Search & Filtering**
- **Filter by amenities**: Seating, Toilets, Beer prices
- **Search by location** or Späti name
- **Sort by rating** or distance

### 👑 **Admin Management**
- **Approval system** for new Spätis and updates
- **Admin dashboard** for content moderation
- **Quality control** to maintain accurate data

![Admin Dashboard](./screenshots/admin-dashboard.png)
*Admin approval interface*

---

## 🎯 User Stories

### 🏠 **Homepage**
Our interactive homepage displays a beautiful map with markers for all approved Spätis in Berlin.

### 👤 **User Authentication**
- **Sign up** with username, email, and profile picture
- **Secure login** with JWT authentication
- **Profile management** with XP tracking

### 🏪 **Späti Management**
- **Browse all Spätis** with filtering options
- **Detailed Späti pages** showing ratings, amenities, and location
- **Add new Spätis** (subject to admin approval)
- **Edit your own Spätis** with update requests

### ⭐ **Rating System**
- **Rate Spätis** from 1-5 stars with comments
- **Edit/delete** your own ratings
- **Like other users' reviews**
- **Earn XP** for every rating you create

### 👑 **Admin Features**
- **Approve/reject** new Späti submissions
- **Moderate content** and manage users
- **Admin-only** approval dashboard

---

## 🛠️ Technical Implementation

### 🎨 **Frontend (React)**
- **React 18** with functional components and hooks
- **Ant Design** for beautiful UI components
- **React Router** for seamless navigation
- **Axios** for API communication
- **Interactive maps** with custom markers
- **Responsive design** for all screen sizes

### ⚙️ **Backend (Node.js + Express)**
- **Express.js** RESTful API
- **MongoDB** with Mongoose ODM
- **JWT authentication** with middleware
- **Cloudinary** for image uploads
- **XP system** with automatic point calculation
- **Admin role-based** access control

### 🔐 **Security Features**
- **JWT token** authentication
- **Password hashing** with bcrypt
- **Protected routes** and middleware
- **Input validation** and sanitization
- **Role-based access** control

---

## 📱 Screenshots

![Späti Details](./screenshots/spaeti-details.png)
*Detailed Späti page with ratings, amenities, and map*

---

## 🗂️ Data Models

### 👤 **User Model**
```javascript
{
  email: String (required, unique),
  password: String (required, hashed),
  username: String (required, unique),
  image: String (profile picture URL),
  xp: Number (default: 0),
  ratings: [ObjectId] (ref: "Rating"),
  favorites: [ObjectId] (ref: "Spaeti"),
  admin: Boolean (default: false)
}
```

### ⭐ **Rating Model**
```javascript
{
  user: ObjectId (ref: "User", required),
  stars: Number (1-5, required),
  comment: String,
  likes: [ObjectId] (ref: "User"),
  spaeti: ObjectId (ref: "Spaeti", required),
  date: Date (default: now)
}
```

### 🏪 **Späti Model**
```javascript
{
  name: String (required),
  street: String (required),
  zip: Number (required),
  city: String (required),
  rating: [ObjectId] (ref: "Rating"),
  averageRating: Number,
  sterni: Number (beer price),
  seats: Boolean,
  wc: Boolean,
  creator: ObjectId (ref: "User"),
  approved: Boolean,
  image: String
}
```

### 🎫 **Ticket Model** (Change Requests)
```javascript
{
  spaeti: ObjectId (ref: "Spaeti", required),
  user: ObjectId (ref: "User", required),
  changes: Object (proposed changes),
  reason: String,
  status: String (pending/approved/rejected),
  admin: ObjectId (ref: "User")
}
```

---

## 🛣️ API Routes

### 🔐 **Authentication**
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `GET /auth/verify` - Token verification

### 👤 **Users**
- `GET /users` - Get all users
- `GET /users/:id` - Get user profile
- `PUT /users/:id` - Update user profile
- `PATCH /users/:id/xp` - Award XP to user
- `GET /users/:id/xp` - Get user XP info
- `GET /users/:id/favorites` - Get user favorites
- `PATCH /users/:id/favorite/:spaetiId` - Add/remove favorite

### 🏪 **Spätis**
- `GET /spaetis` - Get all approved Spätis
- `GET /spaetis/:id` - Get Späti details
- `POST /spaetis` - Create new Späti (awaits approval)
- `PUT /spaetis/:id` - Update Späti
- `DELETE /spaetis/:id` - Delete Späti
- `PATCH /spaetis/:id/approve` - Approve Späti (admin only)

### ⭐ **Ratings**
- `GET /ratings` - Get all ratings
- `GET /ratings/spaeti/:id` - Get ratings for specific Späti
- `GET /ratings/user/:id` - Get user's ratings
- `POST /ratings` - Create rating (awards 10 XP)
- `PUT /ratings/:id` - Update rating
- `DELETE /ratings/:id` - Delete rating
- `PUT /ratings/add-like/:id` - Like a rating
- `PUT /ratings/remove-like/:id` - Unlike a rating

### 🎫 **Tickets** (Change Requests)
- `GET /tickets` - Get all tickets (admin)
- `POST /tickets` - Submit change request
- `PATCH /tickets/:id/approve` - Approve ticket (awards 30 XP)
- `PATCH /tickets/:id/reject` - Reject ticket

---

## 🏆 XP & Level System

Our gamification system encourages community participation:

### 🎯 **XP Rewards**
| Action | XP Awarded | When |
|--------|------------|------|
| Create Späti (with image) | 50 XP | When approved by admin |
| Create Späti (no image) | 40 XP | When approved by admin |
| Submit update request | 30 XP | When approved by admin |
| Leave a rating | 10 XP | Immediately |

### 📊 **Level Calculation**
- **Level = (Total XP ÷ 100) + 1**
- **XP to next level = 100 - (Total XP % 100)**

### 📈 **Profile Display**
- Current XP and level shown on profile
- Progress bar to next level
- XP history and achievements

---

## 🚀 Getting Started

### 📋 **Prerequisites**
- Node.js 18+
- MongoDB
- Cloudinary account (for images)

### ⚡ **Installation**

1. **Clone the repositories**
```bash
# Frontend
git clone https://github.com/ayk0wsk11/spaeti-finder-frontend.git
cd spaeti-finder-frontend
npm install

# Backend
git clone https://github.com/Senfjo/spaeti-finder-backend.git
cd spaeti-finder-backend
npm install
```

2. **Environment Setup**
```bash
# Frontend (.env)
REACT_APP_API_URL=http://localhost:5005
REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_preset

# Backend (.env)
PORT=5005
ORIGIN=http://localhost:3000
TOKEN_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret
MONGODB_URI=your_mongodb_uri
```

3. **Start Development**
```bash
# Backend
npm run dev

# Frontend (new terminal)
npm start
```

---

## 🎨 Tech Stack

### 🖥️ **Frontend**
- ⚛️ **React 18** - Modern UI library
- 🎨 **Ant Design** - Professional UI components
- 🗺️ **Leaflet Maps** - Interactive mapping
- 📡 **Axios** - HTTP client
- 🛣️ **React Router** - Navigation
- 🎯 **Context API** - State management

### ⚙️ **Backend**
- 🚀 **Node.js** - JavaScript runtime
- 🌐 **Express.js** - Web framework
- 🍃 **MongoDB** - NoSQL database
- 🔗 **Mongoose** - ODM
- 🔐 **JWT** - Authentication
- ☁️ **Cloudinary** - Image hosting
- 🔒 **bcrypt** - Password hashing

### 🛠️ **Development Tools**
- 📦 **npm** - Package management
- 🔄 **Git** - Version control
- 🚀 **Netlify** - Frontend deployment
- ☁️ **Render** - Backend deployment

---

## 👥 Team

### 👨‍💻 **Ayko**
- **GitHub**: [@ayk0wsk11](https://github.com/ayk0wsk11)
- **Role**: Frontend Development, UI/UX Design

### 👨‍💻 **Jonathan** 
- **GitHub**: [@Senfjo](https://github.com/Senfjo)
- **Role**: Backend Development, Database Design

---

## 🔗 Links

- 🌐 **[Live Application](https://spaetify.netlify.app/)**
- 💻 **[Frontend Repository](https://github.com/ayk0wsk11/spaeti-finder-frontend)**
- ⚙️ **[Backend Repository](https://github.com/Senfjo/spaeti-finder-backend)**
- 📊 **[Project Slides]()**

---

## 🙏 Acknowledgments

- **Ironhack Berlin** for the amazing bootcamp experience
- **Berlin's Späti culture** for the inspiration
- **The open-source community** for the incredible tools and libraries

---

**Made with ❤️ in Berlin** 🐻
