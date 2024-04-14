import express from "express";
import { userRoutes } from "../modules/user/user.routes";
import { adminRoutes } from "../modules/admin/admin.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { specialtiesRoutes } from "../modules/specialties/specialties.route";
import { doctorRoutes } from "../modules/doctor/doctor.route";
import { patientRoutes } from "../modules/patient/patient.route";

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
];

routes.forEach((route) => {
  router.use(route.routePath, route.routeName);
});

export default router;
