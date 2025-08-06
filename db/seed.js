import db from "#db/client";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  await db.query("TRUNCATE TABLE playlists_tracks, playlists, tracks RESTART IDENTITY CASCADE");

  const tracks = [
    { name: "Bohemian Rhapsody", duration_ms: 355000 },
    { name: "Hotel California", duration_ms: 391000 },
    { name: "Stairway to Heaven", duration_ms: 482000 },
    { name: "Sweet Child O' Mine", duration_ms: 356000 },
    { name: "Billie Jean", duration_ms: 294000 },
    { name: "Imagine", duration_ms: 183000 },
    { name: "Like a Rolling Stone", duration_ms: 369000 },
    { name: "Smells Like Teen Spirit", duration_ms: 301000 },
    { name: "Yesterday", duration_ms: 125000 },
    { name: "Purple Haze", duration_ms: 170000 },
    { name: "What's Going On", duration_ms: 234000 },
    { name: "Respect", duration_ms: 147000 },
    { name: "Good Vibrations", duration_ms: 218000 },
    { name: "Johnny B. Goode", duration_ms: 161000 },
    { name: "Hey Jude", duration_ms: 431000 },
    { name: "I Want to Hold Your Hand", duration_ms: 145000 },
    { name: "Dancing Queen", duration_ms: 231000 },
    { name: "Born to Run", duration_ms: 270000 },
    { name: "Bridge Over Troubled Water", duration_ms: 295000 },
    { name: "The Sound of Silence", duration_ms: 180000 },
    { name: "Wonderwall", duration_ms: 258000 },
    { name: "Crazy", duration_ms: 236000 },
    { name: "Losing My Religion", duration_ms: 267000 },
    { name: "Black", duration_ms: 342000 },
    { name: "Creep", duration_ms: 238000 }
  ];

  for (const track of tracks) {
    await db.query(
      "INSERT INTO tracks (name, duration_ms) VALUES ($1, $2)",
      [track.name, track.duration_ms]
    );
  }

  const playlists = [
    { name: "Classic Rock Hits", description: "The greatest rock songs of all time" },
    { name: "80s Favorites", description: "Best songs from the 1980s" },
    { name: "Chill Vibes", description: "Relaxing songs for any mood" },
    { name: "Road Trip Mix", description: "Perfect songs for a long drive" },
    { name: "Workout Energy", description: "High-energy songs to pump you up" },
    { name: "Acoustic Sessions", description: "Beautiful acoustic versions and originals" },
    { name: "Party Playlist", description: "Dance floor fillers and party anthems" },
    { name: "Rainy Day Blues", description: "Melancholic songs for contemplative moments" },
    { name: "Summer Hits", description: "Feel-good songs for sunny days" },
    { name: "Indie Discoveries", description: "Hidden gems from independent artists" },
    { name: "Throwback Thursday", description: "Nostalgic hits from decades past" },
    { name: "Coffee Shop Ambience", description: "Perfect background music for studying" }
  ];

  for (const playlist of playlists) {
    await db.query(
      "INSERT INTO playlists (name, description) VALUES ($1, $2)",
      [playlist.name, playlist.description]
    );
  }


  const playlistTracks = [
    { playlist_id: 1, track_id: 1 }, // Classic Rock Hits - Bohemian Rhapsody
    { playlist_id: 1, track_id: 2 }, // Classic Rock Hits - Hotel California
    { playlist_id: 1, track_id: 3 }, // Classic Rock Hits - Stairway to Heaven
    { playlist_id: 1, track_id: 4 }, // Classic Rock Hits - Sweet Child O' Mine
    { playlist_id: 2, track_id: 5 }, // 80s Favorites - Billie Jean
    { playlist_id: 2, track_id: 17 }, // 80s Favorites - Dancing Queen
    { playlist_id: 3, track_id: 6 }, // Chill Vibes - Imagine
    { playlist_id: 3, track_id: 20 }, // Chill Vibes - The Sound of Silence
    { playlist_id: 4, track_id: 2 }, // Road Trip Mix - Hotel California
    { playlist_id: 4, track_id: 18 }, // Road Trip Mix - Born to Run
    { playlist_id: 5, track_id: 8 }, // Workout Energy - Smells Like Teen Spirit
    { playlist_id: 5, track_id: 4 }, // Workout Energy - Sweet Child O' Mine
    { playlist_id: 6, track_id: 9 }, // Acoustic Sessions - Yesterday
    { playlist_id: 6, track_id: 19 }, // Acoustic Sessions - Bridge Over Troubled Water
    { playlist_id: 7, track_id: 17 }, // Party Playlist - Dancing Queen
    { playlist_id: 8, track_id: 20 }, // Rainy Day Blues - The Sound of Silence
    { playlist_id: 9, track_id: 13 }, // Summer Hits - Good Vibrations
    { playlist_id: 10, track_id: 21 }, // Indie Discoveries - Wonderwall
    { playlist_id: 11, track_id: 15 }, // Throwback Thursday - Hey Jude
    { playlist_id: 12, track_id: 6 }  // Coffee Shop Ambience - Imagine
  ];

  for (const relation of playlistTracks) {
    await db.query(
      "INSERT INTO playlists_tracks (playlist_id, track_id) VALUES ($1, $2)",
      [relation.playlist_id, relation.track_id]
    );
  }
}