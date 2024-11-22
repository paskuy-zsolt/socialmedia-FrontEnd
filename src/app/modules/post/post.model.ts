import { User } from "../user/user.model";

export interface Post {
    _id: string;                  // Unique identifier for the post
    title: string;                // Title of the post
    content: string;              // Content of the post
    authorId: string;             // ID of the post's author
    authorName?: string;          // (Optional) Name of the post's author
    authorPicture?: string;       // (Optional) URL of the author's picture
    attachments?: string[];       // (Optional) Array of URLs for attached files/images
    createdAt?: string;           // (Optional) Timestamp of post creation
    likes?: string[];             // (Optional) Array of user IDs who liked the post
    likesCount: number;           // Count of likes on the post
    comments: Comment[];          // Array of comments related to the post
}
  
export interface Comment {
    _id: string;                  // Unique identifier for the comment
    content: string;              // Content of the comment
    createdAt: string;            // Timestamp of comment creation
    user: User;
    post: Post;
}
  
  export interface PostsResponse {
    success: boolean;             // Indicates if the response is successful
    posts: Post[];                // Array of posts returned from the API
    totalPages: number;           // Total number of pages available
    currentPage: number;          // Current page number in the response
}