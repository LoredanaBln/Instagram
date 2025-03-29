import type {User} from "~/entities/user";

export interface Post {
    type: string;
    id: number;
    attributes: PostAttributes;
    relationships: PostRelationships;
    links: PostLinks;
}

export interface PostAttributes {
    title: string;
    text: string;
    imagePath: string;
    createdAt: string;
    updatedAt: string;
}

export interface PostRelationships {
    author: User|null;
}

export interface PostLinks {
    self: string;
    parent: string;
}

