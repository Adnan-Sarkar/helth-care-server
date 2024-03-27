import express, { Application } from "express";
import cors from "cors";
import exp from "constants";
import { userRoutes } from "./app/modules/user/user.routes";
import { adminRoutes } from "./app/modules/admin/admin.routes";

const app: Application = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send({
    message: "helth care server",
  });
});

export default app;
