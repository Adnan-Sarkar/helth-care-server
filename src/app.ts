import express, { Application } from "express";
import cors from "cors";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import corn from "node-cron";
import { appointmentService } from "./app/modules/appointment/appointment.service";

const app: Application = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.send({
    message: "helth care server",
  });
});

corn.schedule("* * * * *", () => {
  try {
    appointmentService.cancelUnpaidAppointments();
  } catch (error: any) {}
});

// error handling
app.use(globalErrorHandler);

// not found route
app.use(notFound);

export default app;
