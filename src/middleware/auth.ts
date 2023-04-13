import {NextFunction} from "express";
import jwt from "jsonwebtoken";

const authenticate = (req: Request, res: Response, next: NextFunction) => {
    if(!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    //@ts-ignore
    const token : string = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            //@ts-ignore
            return res.status(401).json({
                message: "Not authorized"
            });
        }
        console.log('auth success')
        //@ts-ignore
        return next()
    })

}

export default authenticate