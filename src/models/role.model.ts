import { model, Schema, Document, Types } from "mongoose";
import { permission } from "process";

export interface RoleDocument extends Document {
    _id: Types.ObjectId; 
    name: string;
    permissions: string[];
}

const roleSchema = new Schema<RoleDocument>(
    {
        name:{type: String, required: true, unique: true},
        permissions: [{type: String}]
    },
    {timestamps:true, collection: "roles"}
);

export const RoleModel = model<RoleDocument>("Role", roleSchema);