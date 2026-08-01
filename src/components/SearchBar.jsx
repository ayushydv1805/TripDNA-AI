import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchPlaces } from "../services/autocomplete";

function SearchBar() {
  const navigate = useNavigate();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);

  async function handleFromChange(value) {
    setFrom(value);

    if (value.length < 2) {
      setFromSuggestions([]);
      return;
    }

    try {
      const places = await searchPlaces(value);
      setFromSuggestions(places);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleToChange(value) {
    setTo(value);

    if (value.length < 2) {
      setToSuggestions([]);
      return;
    }

    try {
      const places = await searchPlaces(value);
      setToSuggestions(places);
    } catch (err) {
      console.error(err);
    }
  }

  function handleSearch() {
    if (!from.trim() || !to.trim()) {
      alert("Please enter both locations.");
      return;
    }

    navigate(
      `/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 mt-12 max-w-5xl mx-auto px-6">

      <div className="relative flex-1">

        <input
          type="text"
          placeholder="📍 From"
          value={from}
          onChange={(e) => handleFromChange(e.target.value)}
          className="w-full p-4 rounded-xl bg-white/10 border border-white/20 outline-none"
        />

        {fromSuggestions.length > 0 && (
          <div className="absolute z-50 bg-slate-900 rounded-xl w-full mt-2 max-h-64 overflow-y-auto shadow-xl">

            {fromSuggestions.map((place, index) => (
              <div
                key={index}
                onClick={() => {
                  setFrom(place.properties.formatted);
                  setFromSuggestions([]);
                }}
                className="p-3 hover:bg-cyan-600 cursor-pointer border-b border-slate-700"
              >
                📍 {place.properties.formatted}
              </div>
            ))}

          </div>
        )}

      </div>
            <div className="relative flex-1">

        <input
          type="text"
          placeholder="📍 To"
          value={to}
          onChange={(e) => handleToChange(e.target.value)}
          className="w-full p-4 rounded-xl bg-white/10 border border-white/20 outline-none"
        />

        {toSuggestions.length > 0 && (
          <div className="absolute z-50 bg-slate-900 rounded-xl w-full mt-2 max-h-64 overflow-y-auto shadow-xl">

            {toSuggestions.map((place, index) => (
              <div
                key={index}
                onClick={() => {
                  setTo(place.properties.formatted);
                  setToSuggestions([]);
                }}
                className="p-3 hover:bg-cyan-600 cursor-pointer border-b border-slate-700"
              >
                📍 {place.properties.formatted}
              </div>
            ))}

          </div>
        )}

      </div>

      <button
        onClick={handleSearch}
        className="bg-cyan-500 hover:bg-cyan-600 px-8 py-4 rounded-xl font-semibold"
      >
        🔍 Search
      </button>

    </div>
  );
}

export default SearchBar;