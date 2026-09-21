import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Hero from "../components/home/Hero";
import SearchBar from "../components/search/SearchBar";
import PopularDestinations from "../components/home/PopularDestinations";
import RecentSearches from "../components/home/RecentSearches";
import SavedTripsPreview from "../components/home/SavedTrips";
import Features from "../components/home/Features";
import Testimonials from "../components/home/Testimonials";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-black text-white">
      <Navbar />
      <Hero />
      <SearchBar />
      <PopularDestinations />
      <RecentSearches />
      <SavedTripsPreview />
      <Features />
      <Testimonials />
      <Footer />
    </div>
  );
}

export default Home;
