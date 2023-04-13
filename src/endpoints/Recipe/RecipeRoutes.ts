import {Router} from "express";
import RecipeController from "./RecipeController";
import authenticate from "../../middleware/auth";
const router:Router = Router();


// @ts-ignore
router.get('/',authenticate ,RecipeController.placeholder);
router.post('/create', RecipeController.createRecipe);

export default router;