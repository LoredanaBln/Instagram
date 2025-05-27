import type {Post} from "~/entities/post";

export interface User {
    type: string;
    id: number;
    attributes: UserAttributes;
    relationships: UserRelationships;
    links: UserLinks;
}

export interface UserAttributes {
    username: string;
    email: string;
    role: string;
    score: number;
    isBanned: boolean;
    imagePath?: string;
}

export interface UserRelationships {
    posts: Post[];
}

export interface UserLinks {
    self: string;
    parent: string;
}
