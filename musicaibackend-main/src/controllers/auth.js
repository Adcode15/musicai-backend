import jwt from 'jsonwebtoken';

export function authenticateUser(req, res, next) {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
  
    jwt.verify(token, 'aapkaswagathai', (err, decoded) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to authenticate token', token });
      }
    
      const userId = decoded.userId; // <-- Make sure userId is the correct property in the decoded token
      console.log(userId)
    
      if (!userId) {
        return res.status(500).json({ error: 'User ID not found in token' });
      }
    
      req.user = { id: userId }; // Attach the user ID to req.user
      next();
    });
  }