import { Post } from "../post/post.model";

export interface User {
    userID: string;
    email?: string;
    name?: string;
    avatar?: string;
    username?: string;
    phone?: string;
    description?: string;
    _id?: string;
    posts?: string[];
}

export interface UserResponse {
    success: boolean;
    users: User[];
}

export interface UserProfileResponse {
    success: boolean;
    user: User;
    posts: Post[];
}

export interface userProfile {
    avatar: string;
    description: string;
    email: string;
    name: string;
    phone: string;
    username: string;
}