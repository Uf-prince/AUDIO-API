import express from "express";
import { exec } from "child_process";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("✅ YT Audio API running");
});

app.get("/ytaudio", (req, res) => {
  let query = req.query.url || req.query.q;

  if (!query) {
    return res.json({ error: "Missing url or query" });
  }

  // 🔍 Agar link nahi hai to ytsearch use hoga
  let target = query.includes("youtube.com") || query.includes("youtu.be")
    ? query
    : `ytsearch1:${query}`;

  const cmd = `yt-dlp -f bestaudio -g "${target}"`;

  exec(cmd, (err, stdout) => {
    if (err || !stdout) {
      return res.status(500).json({ error: "Audio fetch failed" });
    }

    res.json({
      status: true,
      audio: stdout.trim()
    });
  });
});

app.listen(PORT, () => {
  console.log("Server started");
});
