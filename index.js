import express from "express";
import { exec } from "child_process";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("✅ YT Audio API running");
});

app.get("/ytaudio", (req, res) => {
  const query = req.query.url || req.query.q;

  if (!query) {
    return res.json({ error: "Missing url or query" });
  }

  const target =
    query.includes("youtube.com") || query.includes("youtu.be")
      ? query
      : `ytsearch1:${query}`;

  const cmd = `python -m yt_dlp -f bestaudio --no-playlist -g "${target}"`;

  exec(cmd, { maxBuffer: 1024 * 1024 }, (err, stdout, stderr) => {
    if (err || !stdout) {
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
  console.log("YT Audio API running on port", PORT);
});
