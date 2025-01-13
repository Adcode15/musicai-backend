import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken'
import * as bcrypt from "bcrypt";
const prisma = new PrismaClient();

const userRegistration=async (req, res) => {
    const { email, username, password,image } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
  
    try {
      const newUser = await prisma.user.create({
        data: {
          email,
          username,
          password:hashedPassword,
          image
        },
      });
      res.json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
      res.status(500).json({ error: 'Error registering user' ,messgae:error});
    }
  };
  const userLogin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
  
      if (!user) {
        res.status(401).json({ error: "Invalid credentials" });
      } else {
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
  
        if (!isPasswordCorrect) {
          res.status(401).json({ error: "Invalid credentials" });
        } else {
          const token = jwt.sign({ userId: user.id }, 'aapkaswagathai', { expiresIn: '1h' });
  
          res.json({ message: "Login successful", user, token });
        }
      }
    } catch (error) {
      res.status(500).json({ error: "Error during login" ,message:error.message });
    }
  };
  export {userRegistration,userLogin}