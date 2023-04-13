import {Request, Response} from "express";
import UserModel from "./UserModel";
import jwt from "jsonwebtoken";
import * as process from "process";

interface existingUser {
    username: string;
    password: string;

}

const register = async (req: Request, res: Response) => {
    if(!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }

    const { username, password } = req.body;
    console.log('looking for user')
    const existingUser = await UserModel.findOne({ username });

    if (existingUser) {
        return res.status(400).json({ message: 'UserModel already exists' });
    }
    try {


        const user = new UserModel({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            isAdmin: req.body.isAdmin,
            isBanned: req.body.isBanned,
            birthday: req.body.birthday});
        await user.save();

        const token : String = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

const login = async (req: Request, res: Response) => {
    if(!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    const { username, password } = req.body;

    try {
        const existingUser = await UserModel.findOne({ username });

        if (!existingUser) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        const isMatch = await existingUser.comparePassword(password)

        if (!isMatch) {
            res.status(400).json({ error: 'Invalid credentials' });
            res.send();
            return;
        }

        const token = jwt.sign({ id: existingUser._id, username: existingUser.username }, process.env.JWT_SECRET, { expiresIn: '1m' });

        res.status(200).json({ token, existingUser });
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

const placeholder = async (req: Request, res: Response) => {
    res.send("placeholder");
}

const getAllUsers = async (req: Request, res: Response) => {
    const users = await UserModel.find({}).select("-password -_id");
    res.send(users);
}

const getUserByUsername = async (req: Request, res: Response) => {
    if(!req.params.username) {
        res.status(400).send("Username is not defined");
        return;
    }
    const user = await UserModel.findOne({username:req.params.username}).select("-password -_id");
    if(!user) {
        res.status(404).send({error: `User ${req.params.username} not found`});
        return;
    }
    res.status(200).send(user);
}

const updateUser = async (req: Request, res: Response) => {
    /*make sure jwt ist valid or user is admin also via jwt if not abort*/
    try{
        if(!req.body){
            res.status(400).send({error: `User ${req.params.username} could not be updated`});
        }
        const user = await UserModel.findOneAndUpdate({username:req.params.username},{...req.body}, {new:true} ).select("-password");
        res.status(200).send(user);
    } catch (e) {
        res.status(500).send({error: `User ${req.params.username} could not be updated`});
    }


}

const deleteUser = async (req: Request, res: Response) => {
    /*make sure user is admin or same user if not abort - check via jwt*/
    try {
        const username = req.params.username;
        if(!username) {
            res.status(400).send("Username is not defined");
            return;
        }
        const user = await UserModel.findOneAndDelete({username:username});
        res.status(200).send(user);
    } catch (e) {
        res.status(500).send({error: `User ${req.params.username} could not be deleted`});
    }
}

export default {register, login, placeholder, getAllUsers, getUserByUsername, updateUser, deleteUser};