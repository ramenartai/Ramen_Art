// prompt
const SYSTEM_PROMPT = import.meta.env.VITE_SYSTEM_PROMPT;
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const ENDPOINT = import.meta.env.VITE_OPENAI_ENDPOINT_URI;
const deployment = import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT;
const api_version = import.meta.env.VITE_AZURE_OPENAI_API_VERSION;

const handleSubmit = async (e, input, setInput, messages, setMessages) => {
  if (e && e.preventDefault) e.preventDefault();
  if (!input || !input.trim()) return "";

  const userText = input.trim();

  // Optionally update chat UI for user message
  if (setMessages) {
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "user", text: userText },
    ]);
  }
  if (setInput) setInput("");

  const url = `${ENDPOINT}/openai/deployments/${deployment}/chat/completions?api-version=${api_version}`;

  try {
    const conversationHistory = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages
        .filter((m) => m.sender === "user" || m.sender === "system")
        .slice(-10)
        .map((m) => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.text,
        })),
      { role: "user", content: userText },
    ];
    // Debug log: conversation history
    console.log("[DEBUG] Sending conversationHistory:", conversationHistory);
    // Debug log: request URL
    console.log("[DEBUG] Request URL:", url);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": API_KEY,
      },
      body: JSON.stringify({
        messages: conversationHistory,
        max_completion_tokens: 2048,
      }),
    });

    // Debug log: raw response object
    console.log("[DEBUG] Raw response object:", response);
    let data;
    try {
      data = await response.json();
    } catch (jsonErr) {
      data = null;
    }
    if (!response.ok) {
      // Try to extract error message from API response
      let apiErrorMsg = data?.error?.message || data?.error || response.statusText;
      // Check for likely content moderation error
      const isModeration = apiErrorMsg && (
        apiErrorMsg.toLowerCase().includes("content filter") ||
        apiErrorMsg.toLowerCase().includes("safety") ||
        apiErrorMsg.toLowerCase().includes("policy") ||
        apiErrorMsg.toLowerCase().includes("blocked")
      );
      if (isModeration) {
        apiErrorMsg = "Your prompt was blocked by content moderation. Please rephrase your request to avoid unsafe or restricted content.";
      }
      return `Error: ${apiErrorMsg}`;
    }

    // Debug log: parsed response JSON
    console.log("[DEBUG] Parsed response JSON:", data);
    const fullText = data.choices?.[0]?.message?.content || "No response";
    return fullText;
  } catch (err) {
    // Debug log: error
    console.error("[DEBUG] Error in handleSubmit:", err);
    return "Error: " + err.message;
  }
};

export default handleSubmit;