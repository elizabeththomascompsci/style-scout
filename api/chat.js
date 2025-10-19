export default async function handler(req, res) {
  // Collect the raw request body
  let body = "";
  req.on("data", chunk => {
    body += chunk;
  });

  req.on("end", async () => {
    try {
      const parsed = JSON.parse(body || "{}");
      const userMessage = parsed.message || "";

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini", // or "gpt-3.5-turbo" if needed
          messages: [
            {
              role: "system",
              content:
                "You are Style Scout, an AI fashion and shopping assistant. Give confident, fashion-forward outfit ideas and shoppable recommendations."
            },
            { role: "user", content: userMessage }
          ]
        })
      });

      const data = await response.json();
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(data));
    } catch (error) {
      console.error("Server error:", error);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: error.message }));
    }
  });
}

