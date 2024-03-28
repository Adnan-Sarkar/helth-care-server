import express, { Application } from "express";
import cors from "cors";
import router from "./app/routes";

const app: Application = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.send({
    message: "helth care server",
  });
});

export default app;
