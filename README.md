# 🛍️ Prysm — Online Store with Profile Customization

Prysm is a modern online store that includes additional social features. Beyond basic e-commerce functionality, 
users can personalize their profiles by purchasing avatars and banners, 
making the platform feel more personal and dynamic.

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
