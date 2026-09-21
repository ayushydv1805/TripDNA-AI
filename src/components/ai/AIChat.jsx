import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { askTripAI } from "../../services/ai/chat";

function AIChat({ from, to }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAsk() {
    if (!question.trim()) return;

    setLoading(true);

    try {
      const response = await askTripAI(question.trim(), from, to);
      setAnswer(response || "No response was returned.");
      setQuestion("");
    } catch (error) {
      console.error("AI chat error:", error);
      setAnswer(error.message || "Failed to get an AI response.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-slate-800 rounded-xl p-6 my-6">
      <h2 className="text-2xl font-bold mb-5">💬 Ask TripDNA AI</h2>

      <textarea
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        placeholder="Ask anything about your trip..."
        maxLength={1200}
        className="w-full min-h-32 p-4 rounded-xl text-black outline-none"
      />

      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-xs text-slate-400">
          {question.length}/1200
        </span>

        <button
          type="button"
          onClick={handleAsk}
          disabled={loading || !question.trim()}
          className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl font-bold disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Thinking..." : "Ask AI"}
        </button>
      </div>

      {answer && (
        <div className="bg-slate-900 rounded-xl p-5 mt-6">
          <ReactMarkdown>{answer}</ReactMarkdown>
        </div>
      )}
    </section>
  );
}

export default AIChat;
