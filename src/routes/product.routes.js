import { Router } from "express";
import {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByLoggedInUser,
} from "../controllers/product.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post("/add", verifyJWT, upload.single("image"), addProduct);
router.get("/", getProducts);
router.get("/product/:id", getProductById);
router.put("/update/:id", verifyJWT, updateProduct);
router.delete("/delete/:id", verifyJWT, deleteProduct);
router.get("/my-products", verifyJWT, getProductsByLoggedInUser);

export default router;
