import express from "express";
import { exec } from "child_process";

const app = express();
const PORT = process.env.PORT || 3000;

// Health check
app.get("/", (req, res) => {
  res.send("✅ YT Audio API is running");
});

// 🎵 YouTube Audio API
app.get("/ytaudio", (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.json({ error: "Missing YouTube URL" });
  }

  const cmd = `yt-dlp -f bestaudio -g "${url}"`;

  exec(cmd, (err, stdout, stderr) => {
    if (err || !stdout) {
      console.error(stderr);
      return res.status(500).json({ error: "Failed to fetch audio" });
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
