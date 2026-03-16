import express from "express";
import cors from "cors";
import path from "path";
import QRCode from "qrcode";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(process.cwd(), "public")));

// POST /api/qr — returns QR code as PNG image
app.post("/api/qr", async (req, res) => {
  const { text, size = 300, dark = "#000000", light = "#ffffff" } = req.body;
  if (!text) return res.status(400).json({ error: "Missing text or URL" });

  try {
    const buffer = await QRCode.toBuffer(text, {
      width: size,
      color: { dark, light }
    });
    res.setHeader("Content-Type", "image/png");
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ error: "Failed to generate QR code" });
  }
});

// GET /api/qr?text=...  — same but via query param for easy browser testing
app.get("/api/qr", async (req, res) => {
  const { text, size = 300, dark = "#000000", light = "#ffffff" } = req.query;
  if (!text) return res.status(400).json({ error: "Missing text or URL" });

  try {
    const buffer = await QRCode.toBuffer(text, {
      width: parseInt(size),
      color: { dark, light }
    });
    res.setHeader("Content-Type", "image/png");
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ error: "Failed to generate QR code" });
  }
});

// Fallback
app.get("/{*path}", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

export default app;