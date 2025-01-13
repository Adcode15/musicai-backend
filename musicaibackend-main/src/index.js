import express from "express";
import http from "http";
import cors from "cors";
import { config } from "dotenv";
import userRouter from "./routes/user.routes.js";
import songRouter from "./routes/songs.routes.js";
import artistRouter from "./routes/artist.routes.js";
config();
const app = express();
app.use(cors());
const server = http.createServer(app);

app.get("/home", (req, res) => {
  res.send("Hello World!");
});
app.use(express.json());
const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  app.use('/users',userRouter)
  app.use('/songs',songRouter)
  app.use('/artist',artistRouter)
});
