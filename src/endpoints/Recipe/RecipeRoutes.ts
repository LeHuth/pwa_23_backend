import {Router} from "express";
import RecipeController from "./RecipeController";
import authenticate from "../../middleware/auth";
const router:Router = Router();


// @ts-ignore
router.get('/' ,RecipeController.placeholder);
// @ts-ignore
router.post('/create',authenticate, RecipeController.createRecipe);

export default router;