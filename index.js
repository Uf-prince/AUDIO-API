import express from "express";
import { exec } from "child_process";

const app = express();
const PORT = process.env.PORT || 3000;

// Health check
app.get("/", (req, res) => {
  res.send("✅ YT Audio API running");
});

// 🎵 YT Audio Endpoint
app.get("/ytaudio", (req, res) => {
  let query = req.query.url || req.query.q;

  if (!query) {
    return res.json({ error: "Missing url or query" });
  }

  // Agar URL nahi hai to ytsearch use hoga
  let target =
    query.includes("youtube.com") || query.includes("youtu.be")
      ? query
      : `ytsearch1:${query}`;

  // 🔥 PYTHON yt-dlp (HEROKU SAFE)
  const cmd = `python -m yt_dlp -f bestaudio --no-playlist -g "${target}"`;

  exec(cmd, (err, stdout, stderr) => {
    if (err || !stdout) {
      console.error("YT-DLP ERROR:", stderr || err?.message);
      return res.status(500).json({
        error: "Audio fetch failed",
        debug: stderr || err?.message
      });
    }

    res.json({
      status: true,
      audio: stdout.trim()
    });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
