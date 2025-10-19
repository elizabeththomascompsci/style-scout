export default async function handler(req, res) {
  const body = await req.json();
  const userMessage = body.message;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are Style Scout, an AI fashion and shopping assistant. Give confident, fashion-forward outfit ideas and shoppable recommendations." },
        { role: "user", content: userMessage }
      ]
    })
  });

  const data = await response.json();
  res.status(200).json(data);
}
