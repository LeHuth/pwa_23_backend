"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("./models/User"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const router = express_1.default.Router();
function createAdminUser() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const existingAdmin = yield User_1.default.findOne({ username: 'admin' });
            if (!existingAdmin) {
                const adminUser = new User_1.default({ username: 'admin', password: 'admin' });
                yield adminUser.save();
                console.log('Admin user created');
            }
            else {
                console.log('Admin user already exists');
            }
        }
        catch (error) {
            console.error('Error creating admin user:', error);
        }
    });
}
let processEnv = process.env;
function connectToMongo() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Connecting to MongoDB...');
        try {
            if (!processEnv.MONGO_URI) {
                throw new Error("MONGO_URI is not defined");
            }
            const connection = yield mongoose_1.default.connect(processEnv.MONGO_URI);
            console.log('MongoDB connected');
            yield createAdminUser();
        }
        catch (error) {
            console.error('Error connecting to MongoDB:', error);
        }
    });
}
connectToMongo().then(() => {
    if (!processEnv.PORT) {
        throw new Error("PORT is not defined");
    }
    app.listen(processEnv.PORT, () => {
        console.log(`Server started on ${processEnv.PORT}`);
    });
});
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const existingUser = yield User_1.default.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'UserModel already exists' });
        }
        const user = new User_1.default({ username, password });
        yield user.save();
        if (!processEnv.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, processEnv.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token, user });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!processEnv.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    const { username, password } = req.body;
    try {
        const user = yield User_1.default.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'UserModel not found' });
        }
        const isPasswordValid = yield user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, processEnv.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, user });
    }
    catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}));
router.post('/logout', (req, res) => {
    res.status(200).json({ message: 'Logged out successfully' });
});
