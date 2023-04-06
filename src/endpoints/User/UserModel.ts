import mongoose, {Model, Schema} from "mongoose";
import bcrypt from "bcryptjs";

interface IUser {
    username: String;
    password: String;
    email: String;
    birthday: Date;
    isAdmin: Boolean;
    isBanned: Boolean;
    bio: String;
    image: Buffer;
}
interface IUserMethods {
    comparePassword(): Promise<boolean>;
}
type UserModel = Model<IUser,{},IUserMethods>

const UserSchema : Schema = new mongoose.Schema<IUser,UserModel,IUserMethods>({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isAdmin: { type: Boolean, required: true, default: false },
    isBanned: { type: Boolean, required: true, default: false },
    birthday: { type: Date, required: true },
    bio: { type: String, required: false, default: null },
    image: { type: Buffer, required: false, default: null },
});

UserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
UserSchema.method('comparePassword', async function (password : string) : Promise<boolean>
{
    return bcrypt.compare(password, this.password);
});
const UserModel = mongoose.model('UserModel', UserSchema);

export default UserModel;