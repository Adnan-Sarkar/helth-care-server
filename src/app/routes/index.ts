import express from "express";
import { userRoutes } from "../modules/user/user.routes";
import { adminRoutes } from "../modules/admin/admin.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { specialtiesRoutes } from "../modules/specialties/specialties.route";
import { doctorRoutes } from "../modules/doctor/doctor.route";
import { patientRoutes } from "../modules/patient/patient.route";
import { scheduleRoutes } from "../modules/schedule/schedule.route";
import { doctorScheduleRoutes } from "../modules/doctorSchedule/doctorSchedule.route";
import { appointmentRoutes } from "../modules/appointment/appointment.route";
import { paymentRoutes } from "../modules/payment/payment.route";
import { prescriptionRoutes } from "../modules/prescription/prescription.route";
import { reviewRoutes } from "../modules/review/review.route";
import { metaRoutes } from "../modules/Meta/meta.route";

const router = express.Router();

const routes = [
  {
    routePath: "/user",
    routeName: userRoutes,
  },
  {
    routePath: "/admin",
    routeName: adminRoutes,
  },
  {
    routePath: "/auth",
    routeName: authRoutes,
  },
  {
    routePath: "/specialties",
    routeName: specialtiesRoutes,
  },
  {
    routePath: "/doctor",
    routeName: doctorRoutes,
  },
  {
    routePath: "/patient",
    routeName: patientRoutes,
  },
  {
    routePath: "/schedule",
    routeName: scheduleRoutes,
  },
  {
    routePath: "/doctor-schedule",
    routeName: doctorScheduleRoutes,
  },
  {
    routePath: "/appointment",
    routeName: appointmentRoutes,
  },
  {
    routePath: "/payment",
    routeName: paymentRoutes,
  },
  {
    routePath: "/prescription",
    routeName: prescriptionRoutes,
  },
  {
    routePath: "/review",
    routeName: reviewRoutes,
  },
  {
    routePath: "/meta",
    routeName: metaRoutes,
  },
];

routes.forEach((route) => {
  router.use(route.routePath, route.routeName);
});

export default router;
