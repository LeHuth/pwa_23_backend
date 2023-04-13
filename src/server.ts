import express, {Request, Response} from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import UserModel from "./endpoints/User/UserModel";
import UserRoutes from "./endpoints/User/UserRoutes";
import * as process from "process";
import RecipeRoutes from "./endpoints/Recipe/RecipeRoutes";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/users', UserRoutes);
app.use('/api/recipes', RecipeRoutes);

async function createAdminUser() {
    try {
        const existingAdmin = await UserModel.findOne({ username: 'admin' });

        if (!existingAdmin) {
            const adminUser = new UserModel({ username: 'admin', password: 'admin', email: 'admin@mail.com', isAdmin: true, isBanned: false, birthday: new Date(1999,8,21), });
            await adminUser.save();
            console.log('Admin user created');
        } else {
            console.log('Admin user already exists');
        }
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
}

async function connectToMongo() {
    console.log('Connecting to MongoDB...');
try {
    if(!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not defined");
    }
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
    await createAdminUser();
} catch (error) {
    console.error('Error connecting to MongoDB:', error);
}
}
connectToMongo().then(() => {
    if(!process.env.PORT) {
        throw new Error("PORT is not defined");
    }
    app.listen(process.env.PORT, () => {
        console.log(`Server started on ${process.env.PORT}`);
    });
})
