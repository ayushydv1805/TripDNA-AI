import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Search from "./pages/Search";
import TripDetails from "./pages/TripDetails";
import SavedTrips from "./pages/SavedTrips";
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/trip/:id" element={<TripDetails />} />
        <Route path="/saved" element={<SavedTrips />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;