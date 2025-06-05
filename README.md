# 🛍️ Prysm — Online Store with Profile Customization

Prysm is a modern online store that includes additional social features. Beyond basic e-commerce functionality, 
users can personalize their profiles by purchasing avatars and banners, 
making the platform feel more personal and dynamic.

🖥️ Frontend
🔧 Technologies Used

    Next.js — React-based framework with SSR support and built-in routing.

    React — Library for building dynamic UI components.

    TypeScript — Provides static typing and better autocomplete support.

    Tailwind CSS — Utility-first CSS framework for fast and responsive styling.

    Axios — Library for making HTTP requests to the backend.

    React Context API — Used for global state management (e.g., cart and user).

    js-cookie — Manages JWT tokens in client cookies.

✅ Implemented Features
Pages

    🔐 Login page

    📝 Registration page

    🛒 Home page displaying products

    ➕ Product creation page (admin-only)

    👤 User profile page

    🎨 Visual shop (for avatars and banners)

Components

    🔝 Navigation header

    📦 Product card

    🧺 Shopping cart

    📋 Login and registration forms

    🧑‍🎨 Profile customization (avatar, banner)

Additional

    Fully styled using Tailwind CSS

    API requests handled by Axios

    Protected routes based on the presence of JWT in cookies


⚙️ Backend
🔧 Technologies Used

    FastAPI — Asynchronous web framework with high performance.

    Pydantic — For data validation and schema definitions.

    SQLAlchemy — ORM for MySQL database operations.

    Redis — In-memory store for caching frequently accessed data.

    JWT — JSON Web Token-based authentication system.

✅ Implemented Features

    ✅ User registration and login with data validation

    ✅ JWT-based authentication (stored in cookies)

    ✅ CRUD operations for products

    ✅ Product creation restricted to admins

    ✅ Add and retrieve items in the shopping cart

    ✅ Role-based access control (admin vs user)

    ✅ Modular project structure (auth, products, cart, profile, visuals)

    ✅ Customizable user profile

    ✅ Informative error responses

🗄️ Database
🔧 MySQL + SQLAlchemy

Tables are designed to match Pydantic schemas and are validated for integrity.
📊 Main Tables
Table	Purpose
users	Stores login, password hash, role (user/admin), and registration date
products	Product details: name, description, price, category
cart_items	Associates users with their shopping cart items
visual_items	Visual assets (avatars, banners) with type, price, and image path
user_visuals	Links users to purchased visual items
user_settings	Stores currently active avatar and banner for a user

🔁 Caching
🔧 Redis (redis-py)

    🔄 Caches product list responses

    ⏱ Configurable TTL (time-to-live) for cached data

    🧠 If cache is missing, data is pulled from MySQL and stored back in Redis

    📉 Reduces database load and improves performance

🎨 Profile Customization
📌 User Features

    👤 View profile with current avatar and banner

    🛍 Browse the visual item store

    💰 Purchase avatars or banners using internal currency

    🖼 Apply selected customization (saved in DB and shown in profile)

📦 Implementation

    Each visual item has a type (avatar or banner) and a price

    Users can view owned and unowned visual assets

    Selecting a visual item updates the user's profile in real-time

```text
BookStore/
├── main/
│   └── store/
│       └── src/
│       │   ├── authApi.ts
│       │   ├── bookApi.ts
│       │   ├── buyApi.ts
│       │   ├── profileApi.ts
│       │   ├── staticApi.ts
│       │   └── refill.ts
│       ├── api
│       ├── app
│       ├── components
│       ├── store
│       │   ├── auth.ts
│       │   ├── cart.ts
│       │   ├── useToastStore.ts
│       │   └── useWebSocket.ts
│       └── types
│           ├── items.ts
│           └── profles.ts
└── mainServer/
    ├── requirements.txt
    ├── authServer/
    │   ├── .env
    │   └── main.py
    ├── server/
    │  ├── Controllers
    │  ├── Data
    │  ├── Models
    │  └── DTOs
    ├── socketServer/
    │   └── main.py
    └── staticFileServer/
        ├── static/
        │  ├── avatars
        │  ├── banners
        │  └── borders
        └── main.py
```
    
📌 Possible Future Improvements

    📈 Admin dashboard with analytics

    💬 Product comments and reviews

    🔔 User notifications

    🌐 Multi-language support (i18n)

