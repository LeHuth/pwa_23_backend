import {Request, Response} from "express";
import RecipeModel from "./RecipeModel";

const placeholder = async (req: Request, res: Response) => {
    res.send("placeholder");
}

const createRecipe = async (req: Request, res: Response) => {
    const createdRecipe = await RecipeModel.create(req.body);
    res.send("createRecipe");
}

export default {placeholder, createRecipe}