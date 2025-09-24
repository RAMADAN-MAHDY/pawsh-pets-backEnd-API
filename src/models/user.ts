import { Schema, model, Document } from 'mongoose';

interface TUser extends Document {
    username: string;
    avatar?: string;
    googleId?: String;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<TUser>({
    username: { type: String},
    email: { type: String , unique: true },
    password: { type: String},
    avatar: { type: String },   // صورة البروفايل من Google
    googleId: { type: String }, // sub اللي جاي من Google
}, { timestamps: true });

const User = model<TUser>('User', userSchema);
export default User;