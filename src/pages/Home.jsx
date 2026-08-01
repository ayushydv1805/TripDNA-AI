import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import PopularDestinations from "../components/PopularDestinations";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
import RecentSearches from "../components/RecentSearches";
import SavedTrips from "../components/SavedTrips";
function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-black text-white">
      <Navbar />
      <Hero />
      <SearchBar />
      <PopularDestinations />
      <RecentSearches />
      <SavedTrips />
      <Features />
      <Testimonials />
<Footer />
    </div>
  );
}

export default Home;