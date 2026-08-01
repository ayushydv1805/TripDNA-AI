import { useState} from "react";
import { generateTripPlan } from "../services/ai";
import ReactMarkdown from "react-markdown";
import jsPDF from "jspdf";


function AITripPlanner({ from, to }) {
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(10000);
  const [tripType, setTripType] = useState("Adventure");

  const [loading, setLoading] = useState(false);
  const [tripPlan, setTripPlan] = useState("");



async function downloadPDF() {
  try {
    const pdf = new jsPDF();

    pdf.setFontSize(20);
    pdf.text("TripDNA AI - Travel Itinerary", 20, 20);

    pdf.setFontSize(12);
    pdf.text(`From: ${from}`, 20, 35);
    pdf.text(`Destination: ${to}`, 20, 45);
    pdf.text(`Days: ${days}`, 20, 55);
    pdf.text(`Budget: ₹${budget}`, 20, 65);
    pdf.text(`Trip Type: ${tripType}`, 20, 75);

    const lines = pdf.splitTextToSize(tripPlan, 170);

    pdf.text(lines, 20, 90);

    pdf.save(`TripDNA-${from}-to-${to}.pdf`);
  } catch (err) {
    console.error(err);
    alert("PDF download failed");
  }
}
function speakItinerary() {
  if (!tripPlan) return;

  const speech = new SpeechSynthesisUtterance(tripPlan);

  speech.lang = "en-US";
  speech.rate = 1;
  speech.pitch = 1;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(speech);
}
function copyItinerary() {
  navigator.clipboard.writeText(tripPlan);
  alert("Itinerary copied successfully!");
}
function shareItinerary() {
  if (navigator.share) {
    navigator.share({
      title: "TripDNA AI Itinerary",
      text: tripPlan,
    });
  } else {
    alert("Sharing is not supported on this browser.");
  }
}
function stopSpeaking() {
  window.speechSynthesis.cancel();
}
  async function handleGenerate() {
    try {
      setLoading(true);

      const plan = await generateTripPlan(
        from,
        to,
        days,
        budget,
        tripType
      );

      setTripPlan(plan);
    } catch (error) {
      console.error(error);
      alert("Failed to generate itinerary.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-slate-800 rounded-xl p-6 my-6">
      <h2 className="text-2xl font-bold mb-5">
        🤖 AI Trip Planner
      </h2>

      <div className="grid md:grid-cols-3 gap-4">

        <input
          type="number"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          className="p-3 rounded-lg text-black"
        />

        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="p-3 rounded-lg text-black"
        />

        <select
          value={tripType}
          onChange={(e) => setTripType(e.target.value)}
          className="p-3 rounded-lg text-black"
        >
          <option>Adventure</option>
          <option>Family</option>
          <option>Solo</option>
          <option>Couple</option>
        </select>

      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-cyan-500 px-6 py-3 rounded-xl mt-6 font-bold"
      >
        {loading ? "Generating..." : "Generate AI Itinerary"}
      </button>

      {tripPlan && (
  <div
    
    className="bg-slate-900 rounded-xl p-5 mt-6 whitespace-pre-wrap"
  >
    <h2 className="text-2xl font-bold mb-4">
      ✨ AI Itinerary
    </h2>

    <ReactMarkdown>
      {tripPlan}
    </ReactMarkdown>

    <button
      onClick={downloadPDF}
      className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-xl mt-5 font-bold"
    >
      📄 Download PDF
    </button>
<button
  onClick={speakItinerary}
  className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl mt-3 ml-3 font-bold"
>
  🔊 Listen Itinerary
</button>
<button
  onClick={stopSpeaking}
  className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl mt-3 ml-3 font-bold"
>
  ⏹ Stop Voice
</button>
<button
  onClick={copyItinerary}
  className="bg-yellow-600 hover:bg-yellow-700 px-5 py-3 rounded-xl mt-3 ml-3 font-bold"
>
  📋 Copy Itinerary
</button>

<button
  onClick={shareItinerary}
  className="bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-xl mt-3 ml-3 font-bold"
>
  📤 Share Trip
</button>
  </div>
)}
    </div>
  );
}

export default AITripPlanner;