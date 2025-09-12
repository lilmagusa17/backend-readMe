import { DateExpression, Document, Schema, Types, model } from "mongoose";
import { Roles } from "../constants/rolesBurned";

export interface UserDocument extends Document {
    username:string,
    email: string,
    password:string;
    role: Roles;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<UserDocument> (
    {
        username: {type: String, required: true, unique: true},
        email: {type: String, required: true, unique: true, index: true},
        password: {type: String, required: true},
        role:{
            type: String,
            enum: Object.values(Roles),
            default: Roles.READER,
        },
    },
    {timestamps:true, collection: "users"}
);

export const UserModel = model<UserDocument>("User", userSchema)