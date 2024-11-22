export interface User {
    userID: string;
    email?: string;
    name?: string;
    avatar?: string;
    username?: string;
    phone?: number;
    description?: number;
    _id?: string;
    posts?: string[];
}

export interface UserResponse {
    success: boolean;
    users: User[];
}