import express, { Application } from "express";
import cors from "cors";
import exp from "constants";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send({
    message: "helth care server",
  });
});

export default app;
