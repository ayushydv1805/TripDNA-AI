export async function askTripAI(question, from, to) {
  const response = await fetch("/api/ai/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question, from, to }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to get AI response.");
  }

  return data.content;
}
