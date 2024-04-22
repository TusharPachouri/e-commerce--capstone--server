import { Router } from "express";
import {
  addRental,
  getRentals,
  getRentalsByLoggedInUser,
  endRental,
  getRentalsBySellerId,
} from "../controllers/rent.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post("/add/:productId", verifyJWT, addRental);
router.get("/", getRentals);
router.get("/user", verifyJWT, getRentalsByLoggedInUser);
router.patch("/end/:id", verifyJWT, endRental);
router.get("/seller/:id", getRentalsBySellerId);

export default router;
