// Generic API caller
async function callAPI(url, options = {}) {
  try {
    const response = await fetch(url, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      body: options.body ? JSON.stringify(options.body) : null
    });

    if (!response.ok) {
      throw new Error("Error: " + response.status);
    }

    return await response.json();
  } catch (err) {
    return { error: err.message };
  }
}

// AI API (example structure)
async function callAI(prompt) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer YOUR_API_KEY"
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      input: prompt
    })
  });

  const data = await response.json();

  // Extract text safely
  return data?.output?.[0]?.content?.[0]?.text || "No response";
}

// AI Agent logic
async function aiAgent(task) {
  if (task === "users") {
    return await callAPI("https://jsonplaceholder.typicode.com/users");
  }

  if (task === "posts") {
    return await callAPI("https://jsonplaceholder.typicode.com/posts");
  }

  if (task === "ai") {
    return await callAI("Explain JavaScript APIs simply");
  }

  return { message: "Unknown task" };
}

// Connect to UI
async function runAgent(task) {
  const output = document.getElementById("output");
  output.textContent = "Loading...";

  const result = await aiAgent(task);

  output.textContent = JSON.stringify(result, null, 2);
}