import mongoose, {Model, Schema} from "mongoose";

interface IRecipe{
    name: string;
    description: string;
    ingredients: string[];
    instructions: string[];
    time: number;
    difficulty: number;
    image: Buffer;
    owner: object
}

type RecipeModel = Model<IRecipe,{},{}>;

const RecipeSchema : Schema = new mongoose.Schema<IRecipe,RecipeModel,{}>({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    ingredients: { type: [String], required: true },
    instructions: { type: [String], required: true },
    time: { type: Number, required: true },
    difficulty: { type: Number, required: true },
    image: { type: Buffer, required: false, default: null },
    owner: { type: Object, required: true }
});

const RecipeModel = mongoose.model('RecipeModel', RecipeSchema);

export default RecipeModel;