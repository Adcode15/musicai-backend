import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const createSong = async (req, res) => {
  const { title, songUrl, genre } = req.body;
  const artistId = req.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: artistId,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const newSong = await prisma.song.create({
      data: {
        title,
        songUrl,
        genre,
        artistId,
      },
    });

    res.status(201).json(newSong);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error creating song", error: error.message });
  }
};

const getAllSongs = async (req, res) => {
  try {
    const allSongs = await prisma.song.findMany({
      include: {
        artist: true,
      },
    });

    res.json(allSongs);
  } catch (error) {
    console.error("Error getting all songs:", error);
    res.status(500).json({ error: "Error getting all songs" });
  }
};

const getSongById = async (req, res) => {
  const { id } = req.params;

  try {
    const singleSong = await prisma.song.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        artist: true, // Include artist information
      },
    });

    if (!singleSong) {
      return res.status(404).json({ error: "Song not found" });
    }

    res.json(singleSong);
  } catch (error) {
    console.error("Error getting song by ID:", error);
    res.status(500).json({ error: "Error getting song by ID" });
  }
};

const searchSongs = async (req, res) => {
  const { q } = req.query;
  console.log(q);
  try {
    const matchingSongs = await prisma.song.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { genre: { contains: q, mode: "insensitive" } },
        ],
      },
      include: {
        artist: true,
      },
    });

    res.json(matchingSongs);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error searching songs", error: error.message });
  }
};

const deleteSongById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const song = await prisma.song.findUnique({
      where: {
        id: parseInt(id),
      },
      select: {
        artistId: true,
      },
    });

    if (!song) {
      return res.status(404).json({ error: "Song not found" });
    }

    if (song.artistId !== userId) {
      return res
        .status(403)
        .json({
          error: "Permission denied. Only the owner can delete the song.",
        });
    }

    await prisma.song.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.json({ message: "Song deleted successfully" });
  } catch (error) {
    console.error("Error deleting song by ID:", error);
    res.status(500).json({ error: "Error deleting song by ID" });
  }
};
const getSongsByGenre = async (req, res) => {
  const { genre } = req.params; 

  try {
    const songs = await prisma.song.findMany({
      where: {
        genre: {
          equals: genre,
          mode: 'insensitive',
        },
      },
      include: {
        artist: true, 
      },
    });

    res.status(200).json(songs);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching songs by genre", message: error.message });
  }
};

export { createSong, getAllSongs, getSongById, searchSongs, deleteSongById,getSongsByGenre };
