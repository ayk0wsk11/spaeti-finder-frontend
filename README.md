[See the App!](https://spaetify.netlify.app/) Spätify

## Spätify

## Description

Welcome to Spätify! <br/>
            We are two web developers, Ayko and Jonathan, working on an exciting project called "Spätify", for our final project of our Ironhack bootcamp. Our web app aims to help Berlin residents and visitors easily find and rate Spätis, the beloved late-night convenience stores unique to the city. With Spätify, users can discover the best Spätis based on community reviews, ensuring they always find the perfect spot for their late-night needs.

## User Stories

- **homepage** - Our homepage shows a map, with markers for all our spätis
![alt text](image-1.png)
- **sign up** - A page, where you can setup a user profile with a username and password, to enjoy all our features
- **login** - The possibility to login to your profile and verify 
- **All Spätis page** - A page where we show all our Spätis and have the possibility to filter for certain things
- **Späti detail page** - Our detailed page for every Späti, showing the average rating, address, comments, seating possibility and wether the Späti has a toilet
- **Späti create page** - If your Späti is missing, you can add it here. After you add it, it needs to be approved by an admin
- **Späti edit page** - You will be able to update or delete a Späti you added, in case the prices change for example. Only accessible for admins and the user who created the Späti
- **Approval page** - A page only for the admins. We can approve or decline a Späti from here, without going into the database. Of course the page is not accessible for everybody
- **User profile page** - Here we list all of your ratings and all the ratings you liked
- **404** - A page, showing that the URL does not exist
- **about** - This page is showing our intentions with the web app and has the links to our Github

## Backlog Functionalities


- **XP and Batch system** - we already have a system in mind. Adding Spätis, leaving ratings will earn you xp-points. Depending on your xp, you will gain a batch
- **Pictures for Spätis** - for now we decided against, since we only using the free version of cloudinary and rather have a profile picture for the user. In the future we wan't to add the possibility to add pictures to your ratings

## Routes

- GET /
  - fetching users, spätis and ratings
- PATCH
  - update spätis and ratings
- POST
  - sign up, add spätis and ratings 
- DELETE
  - delete ratings and Spätis

## Models
- **User model:**

  user:
    {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
    },
    image: {
      type: String,
      default: "https://pbs.twimg.com/media/EM5IQXcVUAERaFN.jpg",
    },
    xp: {
      type: Number,
      default: 0,
    },
    ratings: {
      type: [Schema.Types.ObjectId],
      ref: "Rating",
    },
    likes: {
      type: [Schema.Types.ObjectId],
      ref: "Rating",
    },
    dislikes: {
      type: [Schema.Types.ObjectId],
      ref: "Rating",
    },
    admin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }



- **Rating Model:**

user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  stars: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
  },
  comment: {
    type: String,
  },
  likes: {
    type: [Schema.Types.ObjectId],
    ref: "User",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  spaeti: {
    type: Schema.Types.ObjectId,
    ref: "Spaeti",
  }

- **Späti model:**

  name: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  zip: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  rating: {
    type: [Schema.Types.ObjectId],
    ref: "Rating",
  },
  sterni: {
    type: Number,
  },
  seats: {
    type: Boolean,
  },
  wc: {
    type: Boolean,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  approved: {
    type: Boolean,
  },
  image: {
    type: String,
    default:
      "https://www.berlin-live.de/wp-content/uploads/sites/10/2024/03/imago0105469791h-e1710357404842.jpg",
  }





## Collaborators

[Ayko](https://github.com/ayk0wsk11)

[Jonathan](https://github.com/Senfjo)

### Project

- [Frontend](https://github.com/ayk0wsk11/spaeti-finder-frontend)
- [Backend](https://github.com/Senfjo/spaeti-finder-backend)
- [Deployed Page](https://spaetify.netlify.app/)



### Slides

[Slides Link]()
