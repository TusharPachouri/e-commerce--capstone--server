import  { Router } from "express";
import { generateContent } from "../controllers/gemini.controllers.js";

const router = Router();

router.route("/generate").get(generateContent);


export default router;