import express from "express";
import db from "#db/client";

const app = express();

app.use(express.json());

const validateId = (id) => {
  const numId = parseInt(id);
  return !isNaN(numId) && numId > 0 ? numId : null;
};

app.get("/tracks", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM tracks ORDER BY id");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching tracks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/tracks/:id", async (req, res) => {
  try {
    const id = validateId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: "Invalid track ID" });
    }

    const result = await db.query("SELECT * FROM tracks WHERE id = $1", [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Track not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching track:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/playlists", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM playlists ORDER BY id");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching playlists:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/playlists", async (req, res, next) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: "Request body is required" });
    }
    
    const { name, description } = req.body;
    
    if (!name || !description) {
      return res.status(400).json({ error: "Name and description are required" });
    }

    const result = await db.query(
      "INSERT INTO playlists (name, description) VALUES ($1, $2) RETURNING *",
      [name, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code) {
      return next(error);
    }
    console.error("Error creating playlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/playlists/:id", async (req, res) => {
  try {
    const id = validateId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: "Invalid playlist ID" });
    }

    const result = await db.query("SELECT * FROM playlists WHERE id = $1", [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching playlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/playlists/:id/tracks", async (req, res) => {
  try {
    const id = validateId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: "Invalid playlist ID" });
    }

    const playlistCheck = await db.query("SELECT id FROM playlists WHERE id = $1", [id]);
    if (playlistCheck.rows.length === 0) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    const result = await db.query(`
      SELECT t.* 
      FROM tracks t
      JOIN playlists_tracks pt ON t.id = pt.track_id
      WHERE pt.playlist_id = $1
      ORDER BY t.id
    `, [id]);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching playlist tracks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/playlists/:id/tracks", async (req, res, next) => {
  try {
    const playlistId = validateId(req.params.id);
    if (!playlistId) {
      return res.status(400).json({ error: "Invalid playlist ID" });
    }

    if (!req.body) {
      return res.status(400).json({ error: "Request body is required" });
    }

    const { trackId } = req.body;
    
    if (!trackId || !validateId(trackId)) {
      return res.status(400).json({ error: "Valid trackId is required" });
    }

    const validTrackId = validateId(trackId);

    const playlistCheck = await db.query("SELECT id FROM playlists WHERE id = $1", [playlistId]);
    if (playlistCheck.rows.length === 0) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    const trackCheck = await db.query("SELECT id FROM tracks WHERE id = $1", [validTrackId]);
    if (trackCheck.rows.length === 0) {
      return res.status(400).json({ error: "Track not found" });
    }

    const result = await db.query(
      "INSERT INTO playlists_tracks (playlist_id, track_id) VALUES ($1, $2) RETURNING *",
      [playlistId, validTrackId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code) {
      return next(error);
    }
    console.error("Error adding track to playlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.use((error, req, res, next) => {
  console.error("Database error:", error);
  
  if (error.code) {
    switch (error.code) {
      case '23505': 
        return res.status(400).json({ error: "Duplicate entry not allowed" });
      case '23503': 
        return res.status(400).json({ error: "Referenced record does not exist" });
      case '23502': 
        return res.status(400).json({ error: "Required field is missing" });
      default:
        return res.status(500).json({ error: "Database error occurred" });
    }
  }
  
  res.status(500).json({ error: "Internal server error" });
});

export default app;
