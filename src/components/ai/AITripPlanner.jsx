import { useState } from "react";
import ReactMarkdown from "react-markdown";
import jsPDF from "jspdf";
import { generateTripPlan } from "../../services/ai/tripPlan";

function AITripPlanner({ from, to }) {
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(10000);
  const [tripType, setTripType] = useState("Adventure");
  const [loading, setLoading] = useState(false);
  const [tripPlan, setTripPlan] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    const safeDays = Number(days);
    const safeBudget = Number(budget);

    if (!Number.isInteger(safeDays) || safeDays < 1 || safeDays > 30) {
      setError("Choose a trip length between 1 and 30 days.");
      return;
    }

    if (!Number.isFinite(safeBudget) || safeBudget < 0) {
      setError("Enter a valid non-negative budget.");
      return;
    }

    setError("");
    setLoading(true);
    setTripPlan("");

    try {
      const plan = await generateTripPlan(
        from,
        to,
        safeDays,
        Math.round(safeBudget),
        tripType
      );
      setTripPlan(plan || "");
    } catch (error) {
      console.error("AI itinerary error:", error);
      setError(error.message || "Failed to generate itinerary.");
    } finally {
      setLoading(false);
    }
  }

  async function copyItinerary() {
    if (!tripPlan) return;

    try {
      await navigator.clipboard.writeText(tripPlan);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error("Copy itinerary error:", error);
      setError("Could not copy the itinerary.");
    }
  }

  async function shareItinerary() {
    if (!tripPlan) return;

    if (!navigator.share) {
      setError("Sharing is not supported in this browser.");
      return;
    }

    try {
      await navigator.share({
        title: "TripDNA AI Itinerary",
        text: tripPlan,
      });
    } catch (error) {
      if (error?.name !== "AbortError") {
        console.error("Share itinerary error:", error);
        setError("Could not share the itinerary.");
      }
    }
  }

  function speakItinerary() {
    if (!tripPlan) return;

    if (!("speechSynthesis" in window)) {
      setError("Text-to-speech is not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(tripPlan);
    speech.lang = "en-US";
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
  }

  function stopSpeaking() {
    window.speechSynthesis?.cancel();
  }

  function downloadPDF() {
    if (!tripPlan) return;

    try {
      const pdf = new jsPDF();
      let y = 20;

      pdf.setFontSize(20);
      pdf.text("TripDNA AI - Travel Itinerary", 20, y);
      y += 15;

      pdf.setFontSize(11);
      [
        "From: " + from,
        "Destination: " + to,
        "Days: " + days,
        "Budget: INR " + budget,
        "Trip Type: " + tripType,
      ].forEach((line) => {
        pdf.text(line, 20, y);
        y += 7;
      });

      y += 5;
      const lines = pdf.splitTextToSize(tripPlan, 170);

      for (const line of lines) {
        if (y > 280) {
          pdf.addPage();
          y = 20;
        }
        pdf.text(line, 20, y);
        y += 6;
      }

      const safeFrom = String(from || "start").replace(/[^a-z0-9]/gi, "-");
      const safeTo = String(to || "destination").replace(/[^a-z0-9]/gi, "-");
      pdf.save("TripDNA-" + safeFrom + "-to-" + safeTo + ".pdf");
    } catch (error) {
      console.error("PDF export error:", error);
      setError("PDF download failed.");
    }
  }

  return (
    <section className="bg-slate-800 rounded-xl p-6 my-6">
      <h2 className="text-2xl font-bold mb-5">🤖 AI Trip Planner</h2>

      <div className="grid md:grid-cols-3 gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-slate-300">Days</span>
          <input
            type="number"
            min="1"
            max="30"
            value={days}
            onChange={(event) => setDays(event.target.value)}
            className="p-3 rounded-lg text-black"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-slate-300">
            Budget (₹)
          </span>
          <input
            type="number"
            min="0"
            step="100"
            value={budget}
            onChange={(event) => setBudget(event.target.value)}
            className="p-3 rounded-lg text-black"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-slate-300">
            Trip Type
          </span>
          <select
            value={tripType}
            onChange={(event) => setTripType(event.target.value)}
            className="p-3 rounded-lg text-black"
          >
            <option>Adventure</option>
            <option>Family</option>
            <option>Solo</option>
            <option>Couple</option>
          </select>
        </label>
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading}
        className="bg-cyan-500 px-6 py-3 rounded-xl mt-6 font-bold disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Generating..." : "Generate AI Itinerary"}
      </button>

      {error && (
        <div className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-100">
          ⚠️ {error}
        </div>
      )}

      {tripPlan && (
        <div className="bg-slate-900 rounded-xl p-5 mt-6">
          <h2 className="text-2xl font-bold mb-4">✨ AI Itinerary</h2>

          <div className="prose prose-invert max-w-none">
            <ReactMarkdown>{tripPlan}</ReactMarkdown>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={downloadPDF} className="bg-green-600 hover:bg-green-500 px-5 py-3 rounded-xl font-bold">
              📄 Download PDF
            </button>
            <button type="button" onClick={speakItinerary} className="bg-blue-600 hover:bg-blue-500 px-5 py-3 rounded-xl font-bold">
              🔊 Listen
            </button>
            <button type="button" onClick={stopSpeaking} className="bg-red-600 hover:bg-red-500 px-5 py-3 rounded-xl font-bold">
              ⏹ Stop
            </button>
            <button type="button" onClick={copyItinerary} className="bg-yellow-600 hover:bg-yellow-500 px-5 py-3 rounded-xl font-bold">
              {copied ? "✅ Copied" : "📋 Copy"}
            </button>
            <button type="button" onClick={shareItinerary} className="bg-purple-600 hover:bg-purple-500 px-5 py-3 rounded-xl font-bold">
              📤 Share
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default AITripPlanner;
