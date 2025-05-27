import type {Post} from "~/entities/post";

export type Tag = {
    id: number;
    title: string;
    post: Post[];
};