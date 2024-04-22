import { Router } from "express";
import {
  addRental,
  getRentals,
  getRentalsByLoggedInUser,
} from "../controllers/rent.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post("/add/:productId", verifyJWT, addRental);
router.get("/", getRentals);
router.get("/user", verifyJWT, getRentalsByLoggedInUser);

export default router;
