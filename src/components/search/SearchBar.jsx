import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchPlaces } from "../../services/geospatial/autocomplete.js";

function SearchBar() {
  const navigate = useNavigate();
  const fromRequestId = useRef(0);
  const toRequestId = useRef(0);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [searchingFrom, setSearchingFrom] = useState(false);
  const [searchingTo, setSearchingTo] = useState(false);

  async function handleLocationChange(value, setValue, setSuggestions, setSearching, requestRef) {
    setValue(value);
    const currentRequest = ++requestRef.current;

    if (value.trim().length < 2) {
      setSuggestions([]);
      setSearching(false);
      return;
    }

    setSearching(true);

    try {
      const places = await searchPlaces(value);
      if (currentRequest === requestRef.current) setSuggestions(places);
    } catch (error) {
      console.error("Location suggestion error:", error);
      if (currentRequest === requestRef.current) setSuggestions([]);
    } finally {
      if (currentRequest === requestRef.current) setSearching(false);
    }
  }

  function handleSearch() {
    const start = from.trim();
    const destination = to.trim();

    if (!start || !destination) {
      alert("Please enter both locations.");
      return;
    }

    navigate("/search?from=" + encodeURIComponent(start) + "&to=" + encodeURIComponent(destination));
  }

  function renderSuggestions(suggestions, setValue, setSuggestions, requestRef) {
    return suggestions.length > 0 ? (
      <div className="absolute z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-xl bg-slate-900 shadow-xl">
        {suggestions.map((place, index) => {
          const value = place.properties?.formatted || "Unknown location";
          return (
            <button
              type="button"
              key={place.properties?.place_id || place.properties?.osm_id || index}
              onClick={() => {
                setValue(value);
                setSuggestions([]);
                ++requestRef.current;
              }}
              className="block w-full border-b border-slate-700 p-3 text-left transition hover:bg-cyan-600"
            >
              📍 {value}
            </button>
          );
        })}
      </div>
    ) : null;
  }

  return (
    <div className="mx-auto mt-12 flex max-w-5xl flex-col gap-4 px-6 md:flex-row">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="📍 From"
          value={from}
          onChange={(event) => handleLocationChange(event.target.value, setFrom, setFromSuggestions, setSearchingFrom, fromRequestId)}
          className="w-full rounded-xl border border-white/20 bg-white/10 p-4 outline-none transition focus:border-cyan-400/50"
        />
        {searchingFrom && <p className="absolute right-3 top-4 text-xs text-slate-400">Searching...</p>}
        {renderSuggestions(fromSuggestions, setFrom, setFromSuggestions, fromRequestId)}
      </div>

      <div className="relative flex-1">
        <input
          type="text"
          placeholder="📍 To"
          value={to}
          onChange={(event) => handleLocationChange(event.target.value, setTo, setToSuggestions, setSearchingTo, toRequestId)}
          className="w-full rounded-xl border border-white/20 bg-white/10 p-4 outline-none transition focus:border-cyan-400/50"
        />
        {searchingTo && <p className="absolute right-3 top-4 text-xs text-slate-400">Searching...</p>}
        {renderSuggestions(toSuggestions, setTo, setToSuggestions, toRequestId)}
      </div>

      <button type="button" onClick={handleSearch} className="rounded-xl bg-cyan-400 px-8 py-4 font-semibold text-slate-950 transition hover:bg-cyan-300 md:min-w-32">
        🔍 Search
      </button>
    </div>
  );
}

export default SearchBar;
