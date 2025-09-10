import { DateExpression, Document, Schema, Types, model } from "mongoose";

export interface UserDocument extends Document {
    username:string,
    email: string,
    password:string;
    role:Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<UserDocument> (
    {
        username: {type: String, required: true, unique: true},
        email: {type: String, required: true, unique: true, index: true},
        password: {type: String, required: true},
        role: {type:Schema.Types.ObjectId, ref: "Role", required: true}
    },
    {timestamps:true, collection: "users"}
);

export const UserModel = model<UserDocument>("User", userSchema)