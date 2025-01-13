import { PrismaClient } from "@prisma/client";
const prisma=new PrismaClient();

const getTopArtists = async (req, res) => {
    try {
      const topArtists = await prisma.user.findMany({
        take: 5,
        orderBy: {
          songs: {
            _count: 'desc',
          },
        },
        select: {
          id: true,
          username: true,
          image: true,
        },
      });
      if (!topArtists || topArtists.length === 0) {
        return res.status(404).json({ error: 'Top artists not found' });
      }
  
      res.json({ topArtists });
    } catch (error) {
      console.error('Error getting top artists:', error);
      res.status(500).json({ error: 'Error getting top artists' });
    }
  };

  const getAllArtists = async (req, res) => {
    try {
      const allArtists = await prisma.user.findMany({
        select: {
          id: true,
          username: true,
          image: true,
        },
      });
  
      if (!allArtists || allArtists.length === 0) {
        return res.status(404).json({ error: 'No artists found' });
      }
  
      res.json({ allArtists });
    } catch (error) {
      console.error('Error getting all artists:', error);
      res.status(500).json({ error: 'Error getting all artists' });
    }
  };
  const getArtistById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const artist = await prisma.user.findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
          songs: true,
        },
      });
  
      if (!artist) {
        return res.status(404).json({ error: 'Artist not found' });
      }
  
      res.json(artist);
    } catch (error) {
      
      res.status(500).json({ error: 'Error getting artist by ID',error: error.message });
    }
  };
  export {getTopArtists,getAllArtists,getArtistById}