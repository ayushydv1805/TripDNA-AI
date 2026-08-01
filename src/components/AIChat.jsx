import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { askTripAI } from "../services/aiChat";

function AIChat({ from, to }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAsk() {
    if (!question.trim()) return;

    try {
      setLoading(true);

      const response = await askTripAI(question, from, to);

      setAnswer(response);
    } catch (err) {
      console.error(err);
      setAnswer("❌ Failed to get AI response.");
    } finally {
      setLoading(false);
    }
  }
  return (
  <div className="bg-slate-800 rounded-xl p-6 my-6">

    <h2 className="text-2xl font-bold mb-5">
      💬 Ask TripDNA AI
    </h2>

    <textarea
      value={question}
      onChange={(e) => setQuestion(e.target.value)}
      placeholder="Ask anything about your trip..."
      className="w-full h-32 p-4 rounded-xl text-black"
    />

    <button
      onClick={handleAsk}
      disabled={loading}
      className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl mt-4 font-bold"
    >
      {loading ? "Thinking..." : "Ask AI"}
    </button>

    {answer && (
      <div className="bg-slate-900 rounded-xl p-5 mt-6">
        <ReactMarkdown>
          {answer}
        </ReactMarkdown>
      </div>
    )}

  </div>
);
}

export default AIChat;