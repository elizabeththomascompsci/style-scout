export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end("Method Not Allowed");
    return;
  }

  try {
    // read raw body
    let body = "";
    await new Promise((resolve, reject) => {
      req.on("data", chunk => (body += chunk));
      req.on("end", resolve);
      req.on("error", reject);
    });

    const { message } = JSON.parse(body || "{}");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // use a universally available model
        messages: [
          {
            role: "system",
            content:
              "You are Style Scout, an AI fashion and shopping assistant. Give confident, fashion-forward outfit ideas and shoppable recommendations."
          },
          { role: "user", content: message || "" }
        ]
      })
    });

    const text = await response.text();
    console.log("OpenAI raw response:", text); // <— this line prints to Vercel logs

    try {
      const data = JSON.parse(text);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(data));
    } catch (err) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Invalid JSON", raw: text }));
    }
  } catch (err) {
    console.error("Server error:", err);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: err.message }));
  }
}
