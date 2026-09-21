# 🌍 TripDNA AI

> **Plan Smarter. Travel Better.**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Ready-FFCA28?logo=firebase)](https://firebase.google.com/)
[![Leaflet](https://img.shields.io/badge/Maps-Leaflet-199900?logo=leaflet)](https://leafletjs.com/)

TripDNA AI is an AI-assisted travel planning web application that brings routes, maps, weather, nearby places, travel modes, budget estimation, favorites, saved trips, and AI-generated itineraries into a single trip-planning workflow.

The app is built as a Vite SPA with a feature-oriented React structure. External integrations are isolated behind service modules, while OpenRouter-powered AI operations run through Vercel server functions.

---

## 🌐 Project

| Item | Link |
| --- | --- |
| 🌍 Web App | https://trip-dna-ai.vercel.app/ |
| 💻 GitHub | https://github.com/ayushydv1805/TripDNA-AI |
| ☁️ Hosting | Vercel |

---

## 📖 Contents

- What the App Does
- Core Features
- User Flow
- Architecture
- Search Data Flow
- AI Architecture
- Trip Budget and Travel Logic
- Project Structure
- Folder Responsibilities
- Application Routes
- API Integrations
- Environment Variables
- Local Development
- Available Scripts
- Vercel Deployment
- Error Handling
- Refactoring Principles
- Known Limitations
- Roadmap
- Contributing
- Definition of Done

---

## 🎯 What the App Does

TripDNA AI follows a simple idea:

> **Enter where you are, choose where you want to go, and get the important trip information in one place.**

A search can combine:

- 📍 Starting and destination coordinates
- 🛣️ Driving route
- 📏 Distance
- ⏱️ Estimated duration
- 🌤️ Current weather
- 📅 Forecast
- 🏨 Hotels
- 🍽️ Restaurants
- 📍 Attractions
- 🏥 Hospitals
- 💊 Pharmacies
- 🏧 ATMs
- ⛽ Petrol pumps
- 🚗 Travel-mode comparisons
- 💰 Estimated budget
- 🗺️ Interactive map
- 📸 Destination images
- 🤖 AI itinerary
- 💬 AI travel assistant

---

## ✨ Core Features

### 🗺️ Smart Trip Search

Enter a starting location and destination. The application resolves the locations, calculates a route, and loads supporting destination information.

### 📍 Location Autocomplete

Geoapify-powered autocomplete helps users select locations instead of manually typing long addresses.

### 🚗 Route Planning

The routing layer uses OSRM and returns distance, duration, and GeoJSON route coordinates for the map.

### 🌤️ Weather

TripDNA AI can display current temperature, weather condition, description, humidity, wind, icon, and a multi-day forecast.

### 🏨 Destination Discovery

The app searches for hotels, restaurants, tourist attractions, hospitals, pharmacies, ATMs, and petrol pumps around the destination.

### 🗺️ Interactive Maps

The map shows the starting location, destination, and route polyline. Individual places can open in Google Maps.

### 💰 Budget Estimation

The budget module estimates major trip costs using configurable assumptions for fuel, accommodation, food, and sightseeing. These are estimates, not live booking prices.

### 🚆 Travel Mode Comparison

Travel options currently include car, bus, train, and flight. Each mode keeps a numeric time value for comparison and a formatted display value.

### 💡 Smart Recommendation

The UI can surface the lowest estimated price and lowest estimated travel time from the generated travel-mode dataset.

### ❤️ Favorites

Hotels, restaurants, and attractions can be saved locally with their type, name, address, coordinates, and available provider ID.

### 💾 Saved Trips

Recent trip searches are stored in browser localStorage and can be viewed from the Saved Trips screen.

### 🤖 AI Trip Planner

Users can provide trip length, budget, and trip type to request a generated itinerary through the server-side AI endpoint.

### 💬 AI Travel Assistant

Users can ask trip-specific questions with the selected start and destination passed as context.

### 📄 PDF Export

Generated itineraries can be exported with jsPDF.

### 🔊 Text-to-Speech

Generated itinerary text can be read aloud with the browser Web Speech API when supported.

### 📤 Native Share

On supported devices, the itinerary can be shared with the Web Share API.

### 📱 Responsive Navigation

The navigation includes a mobile menu for smaller screens.

### 🚫 Custom 404

Unknown React routes render a dedicated NotFound page. Vercel rewrites browser routes to the SPA entry point before React Router resolves the final route.

~~~text
vercel.json
    ↓
/anything
    ↓
/index.html
    ↓
React Router
    ↓
NotFound.jsx
~~~

---

## 👤 User Flow

~~~mermaid
flowchart TD
    A[Open TripDNA AI] --> B[Enter From Location]
    B --> C[Enter Destination]
    C --> D[Autocomplete Suggestions]
    D --> E[Search]
    E --> F[Resolve Coordinates]
    F --> G[Calculate Route]
    G --> H[Load Destination Data]

    H --> I[Trip Dashboard]
    I --> J[Weather + Forecast]
    I --> K[Hotels + Restaurants + Attractions]
    I --> L[Emergency Services]
    I --> M[Travel Modes + Budget]
    I --> N[Interactive Map]
    I --> O[AI Trip Planner]
    I --> P[AI Travel Assistant]

    K --> Q[Save Favorite]
    E --> R[Save Trip]
    R --> S[Saved Trips]
    Q --> T[Favorites]
~~~

---

## 🧠 Architecture

~~~mermaid
flowchart TD
    Browser[User Browser]

    Browser --> React[React + Vite]
    React --> Router[React Router]

    Router --> Pages[Route Pages]
    Pages --> Features[Feature Modules]
    Pages --> Components[Reusable Components]

    Features --> Hooks[React Hooks]
    Features --> FeatureServices[Feature Services]

    FeatureServices --> Geospatial[Geospatial APIs]
    FeatureServices --> Weather[Weather Services]
    FeatureServices --> Media[Media Services]
    FeatureServices --> Storage[Local Storage]
    FeatureServices --> Travel[Travel Calculations]

    Components --> UI[Trip UI / Cards / Map]

    React --> API[Vercel Server Functions]
    API --> OpenRouter[OpenRouter AI]

    React --> Firebase[Firebase SDK]
~~~

| Layer | Responsibility |
| --- | --- |
| src/app | Application shell and routes |
| src/pages | Route-level screens |
| src/features | Feature-specific orchestration |
| src/components | Reusable UI grouped by domain |
| src/services | APIs, storage, and domain calculations |
| src/config | Shared constants |
| src/lib | Third-party SDK initialization |
| api | Server-side AI endpoints |

---

## 🔄 Search Data Flow

~~~mermaid
sequenceDiagram
    participant U as User
    participant P as Search Page
    participant H as useTripSearchData
    participant L as loadTripData
    participant G as Geocoding
    participant R as Routing
    participant D as Destination APIs
    participant UI as SearchResults

    U->>P: Enter From + To
    P->>H: Load trip
    H->>L: loadTripData(from, to)

    L->>G: Resolve both locations
    G-->>L: Coordinates

    L->>R: Calculate route
    R-->>L: Distance + Duration + Geometry

    par Supporting data
        L->>D: Weather + Forecast
        L->>D: Hotels + Restaurants + Attractions
        L->>D: Hospitals + Pharmacies + ATMs + Fuel
        L->>D: Destination Images
    end

    D-->>L: Normalized data
    L-->>H: Trip object
    H-->>P: Loading / Data / Error
    P->>UI: Render complete trip dashboard
~~~

---

## 🤖 AI Architecture

~~~mermaid
flowchart LR
    User[User] --> Planner[AI Trip Planner]
    User --> Chat[AI Travel Assistant]

    Planner --> TripService[services/ai/tripPlan.js]
    Chat --> ChatService[services/ai/chat.js]

    TripService --> TripAPI[/api/ai/trip-plan]
    ChatService --> ChatAPI[/api/ai/chat]

    TripAPI --> OpenRouter[OpenRouter API]
    ChatAPI --> OpenRouter
~~~

The frontend sends AI requests to the application's own Vercel API routes instead of directly embedding the OpenRouter secret in the UI code.

Server-side variable:

~~~env
OPENROUTER_API_KEY=...
~~~

---

## 💰 Trip Budget and Travel Logic

### Budget

The budget module calculates an estimate from fuel, hotel, food, and sightseeing assumptions.

~~~text
Fuel cost
Hotel cost
Food cost
Sightseeing estimate
--------------------
Estimated total
~~~

### Travel Modes

Each mode keeps:

~~~text
timeHours → numeric comparison
time      → human-readable display
price     → estimated cost
~~~

---

## 🗂️ Project Structure

~~~text
TripDNA-AI/
│
├── api/
│   └── ai/
│       ├── chat.js
│       └── trip-plan.js
│
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   ├── app/
│   │   └── App.jsx
│   │
│   ├── config/
│   │   └── constants.js
│   │
│   ├── features/
│   │   └── search/
│   │       ├── components/
│   │       │   └── SearchResults.jsx
│   │       ├── hooks/
│   │       │   └── useTripSearchData.js
│   │       ├── services/
│   │       │   └── loadTripData.js
│   │       └── utils/
│   │           └── recentSearches.js
│   │
│   ├── components/
│   │   ├── ai/
│   │   ├── discovery/
│   │   ├── home/
│   │   ├── layout/
│   │   ├── search/
│   │   └── trip/
│   │
│   ├── lib/
│   │   └── firebase.js
│   │
│   ├── pages/
│   │   ├── Favorites.jsx
│   │   ├── Home.jsx
│   │   ├── NotFound.jsx
│   │   ├── Profile.jsx
│   │   ├── SavedTrips.jsx
│   │   ├── Search.jsx
│   │   └── TripDetails.jsx
│   │
│   └── services/
│       ├── ai/
│       ├── geospatial/
│       ├── media/
│       ├── storage/
│       ├── travel/
│       └── weather/
│
├── .env.example
├── index.html
├── package.json
├── vercel.json
└── vite.config.js
~~~

---

## 📦 Folder Responsibilities

| Folder | Responsibility |
| --- | --- |
| src/app | Application shell and route registration |
| src/pages | Full route screens |
| src/components | Reusable UI organized by domain |
| src/features | Feature-specific state and orchestration |
| src/services | External APIs, local storage, and calculations |
| src/config | Shared application configuration |
| src/lib | Third-party SDK initialization |
| api | Vercel server functions |

### Component domains

- ai/ → AI user interfaces
- discovery/ → hotels, weather, attractions, restaurants, images, essentials
- home/ → homepage sections
- layout/ → navigation and footer
- search/ → search input and autocomplete UI
- trip/ → routes, map, budget, travel modes, advisories

---

## 🛣️ Application Routes

| Route | Purpose |
| --- | --- |
| / | Home and trip search |
| /search | Trip search results |
| /trip/:id | Trip details screen |
| /saved | Saved trips |
| /favorites | Saved places |
| /profile | Local traveler dashboard |
| * | Custom 404 |

Search URLs use:

~~~text
/search?from=Chandigarh&to=Manali
~~~

---

## 🔌 API Integrations

| Service | Used for |
| --- | --- |
| Geoapify | Autocomplete and nearby places |
| Nominatim / OpenStreetMap | Geocoding |
| OSRM | Driving route calculation |
| OpenWeather | Current weather and forecast |
| Unsplash | Destination imagery |
| YouTube | Travel videos |
| OpenRouter | AI itinerary and AI assistant |
| Firebase | Authentication / Firestore SDK support |
| Google Maps links | External map navigation |

Provider-specific code lives under src/services/.

---

## 🔐 Environment Variables

### Browser-side

~~~env
VITE_GEOAPIFY_API_KEY=
VITE_OPENWEATHER_API_KEY=
VITE_UNSPLASH_API_KEY=
VITE_YOUTUBE_API_KEY=
VITE_GEMINI_API_KEY=
~~~

### Firebase

~~~env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
~~~

### Server-side AI

~~~env
OPENROUTER_API_KEY=
~~~

Never commit secrets. Use .env.local for local private values. The repository includes .env.example as a template.

---

## 🚀 Local Development

### Clone

~~~bash
git clone https://github.com/ayushydv1805/TripDNA-AI.git
cd TripDNA-AI
~~~

### Install

~~~bash
npm install
~~~

### Configure

Copy .env.example to .env.local and add the provider keys you have configured.

### Start

~~~bash
npm run dev
~~~

---

## 🧪 Available Scripts

| Command | Purpose |
| --- | --- |
| npm run dev | Start Vite development server |
| npm run build | Build production frontend |
| npm run preview | Preview production build locally |
| npm run lint | Run ESLint |

---

## ☁️ Vercel Deployment

TripDNA AI is structured as a Vite SPA deployed to Vercel.

vercel.json rewrites browser requests to index.html so React Router can resolve application routes and the custom 404 screen.

Server functions:

~~~text
/api/ai/chat
/api/ai/trip-plan
~~~

These functions read the server-side OPENROUTER_API_KEY.

---

## 🛡️ Error Handling

The current architecture uses graceful failure behavior:

- Missing API key → service returns a safe fallback where appropriate.
- Non-2xx API response → service returns safe fallback data and logs the failure.
- Invalid locations → search shows a user-facing error.
- Route failure → incomplete trip dashboard is not rendered.
- AI failure → the AI component displays an error.
- Unsupported speech → the UI explains that the browser lacks support.
- Unsupported sharing → the UI explains that native sharing is unavailable.
- Corrupt localStorage data → storage utilities fall back safely.
- Unknown route → NotFound screen.
- Async search completion after navigation → cancelled flag prevents stale state updates.

---

## 🧹 Refactoring Principles

TripDNA AI was reorganized around responsibility and domain instead of keeping unrelated logic inside large page files.

### Previous pattern

~~~text
Page
├── UI
├── state
├── API calls
├── loading
├── error handling
├── localStorage
├── budget logic
├── routing
├── weather
├── places
└── images
~~~

### Current pattern

~~~text
Page
  ↓
Feature Hook
  ↓
Feature Service
  ↓
Domain Services
  ↓
Reusable Components
~~~

Key rules:

- Keep pages route-focused.
- Put feature-specific orchestration inside src/features.
- Put external integrations inside src/services.
- Keep reusable UI components small.
- Keep browser persistence inside storage services.
- Keep shared configuration in src/config.
- Keep third-party SDK initialization in src/lib.
- Keep AI transport separate from AI presentation.
- Normalize external API data at service boundaries.
- Keep numeric values numeric internally and format them at the UI boundary.

---

## ⚠️ Known Limitations

- External APIs can rate-limit or become unavailable.
- Some browser-side provider keys are exposed to the client by design and should be restricted at the provider level.
- Favorites and saved trips use browser localStorage.
- There is currently no complete automated test suite.
- Route and travel-mode costs are estimates, not live booking quotes.
- Weather and place information can change after the response is retrieved.
- AI output is generated guidance, not a guaranteed real-time travel source.
- The Gemini integration exists as a separate service implementation but is not the primary AI flow.
- Firebase is isolated as an SDK layer, while the current main save/favorite flow uses local storage.

---

## 🔮 Roadmap

### Reliability

- [ ] Unit tests for travel calculations.
- [ ] Tests for trip search loading.
- [ ] Component tests.
- [ ] End-to-end tests for the main search journey.
- [ ] Abortable requests with AbortController.
- [ ] Retry/backoff for transient provider failures.

### UX

- [ ] Replace browser alert validation with reusable in-app feedback.
- [ ] Add skeleton loaders for dashboard sections.
- [ ] Add richer empty states for unavailable data.
- [ ] Improve keyboard navigation and accessibility testing.

### Data

- [ ] Persist trips and favorites through Firebase after authentication is enabled.
- [ ] Add richer trip history.
- [ ] Add custom budget assumptions.
- [ ] Add date-aware itinerary planning.

### AI

- [ ] Add rate limiting and abuse protection.
- [ ] Add structured itinerary validation.
- [ ] Return structured itinerary data instead of markdown-only responses.
- [ ] Add AI provider fallback support.
- [ ] Cache repeated itinerary requests where appropriate.

### Product

- [ ] User authentication and profiles.
- [ ] Shareable trip URLs.
- [ ] Collaborative trip planning.
- [ ] Booking links with richer route context.
- [ ] More detailed destination recommendations.
- [ ] Trip analytics and travel history.

---

## 🤝 Contributing

Create a focused branch:

~~~bash
git checkout -b feature/your-feature
~~~

Place code according to responsibility:

~~~text
New route          → src/pages/
Reusable UI        → src/components/
Feature logic      → src/features/
API integration    → src/services/
SDK initialization → src/lib/
Constants          → src/config/
Server AI          → api/
~~~

Recommended commit prefixes:

~~~text
feat:
fix:
refactor:
style:
docs:
test:
chore:
~~~

Examples:

~~~bash
git commit -m "feat: add destination weather chart"
git commit -m "fix: handle route API failure"
git commit -m "refactor: extract search orchestration hook"
git commit -m "docs: update architecture diagram"
~~~

---

## ✅ Definition of Done

A feature is complete when:

- The intended user flow works.
- It follows the domain-oriented folder structure.
- Loading and error states are handled.
- No secrets are added to source control.
- Desktop and mobile layouts remain usable.
- Existing routes are not broken.
- Provider failures fail gracefully.
- Relevant lint/build checks have been run.
- Documentation is updated when architecture changes.

---

## 🧭 Quick Debugging Guide

### Search is not working

~~~text
Home
  ↓
SearchBar
  ↓
/search?from=...&to=...
  ↓
Search page
  ↓
useTripSearchData
  ↓
loadTripData
~~~

### Route is missing

~~~text
geocoding → routing → SearchResults → MapView
~~~

### Weather is missing

~~~text
VITE_OPENWEATHER_API_KEY
  ↓
services/weather/weather.js
  ↓
loadTripData
  ↓
WeatherCard / ForecastCard
~~~

### AI is failing

~~~text
AITripPlanner / AIChat
  ↓
services/ai
  ↓
api/ai
  ↓
OPENROUTER_API_KEY
  ↓
OpenRouter
~~~

### Favorites are missing

~~~text
Discovery cards
  ↓
services/storage/favorites.js
  ↓
Favorites page
~~~

### Direct route gives 404

~~~text
vercel.json
+
React Router *
+
NotFound.jsx
~~~

---

## 📌 Engineering Summary

TripDNA AI now follows a domain-oriented architecture where each layer has a clear responsibility.

~~~text
┌──────────────────────────────┐
│          React UI            │
├──────────────────────────────┤
│ Pages → Features → Components│
├──────────────────────────────┤
│       Service Layer          │
│ Maps / Weather / Media / AI  │
│ Storage / Travel Calculations│
├──────────────────────────────┤
│     Vercel Server APIs       │
├──────────────────────────────┤
│   OpenRouter + Other APIs    │
└──────────────────────────────┘
~~~

The goal of the structure is simple: a new developer should be able to identify where a feature belongs before opening a large file.

---

## 👨‍💻 TripDNA AI

**Plan Smarter. Travel Better.**

[🌍 Open TripDNA AI](https://trip-dna-ai.vercel.app/)

[💻 View on GitHub](https://github.com/ayushydv1805/TripDNA-AI)