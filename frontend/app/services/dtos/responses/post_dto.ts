import type {RelationshipDTO} from "~/services/dtos/relationship_dto";

export interface PostDTO {
    type: 'posts',
    attributes: {
        title: string;
        text: string;
        status: string;
        imagePath: string | null;
        createdAt: string;
        updatedAt: string;
        tags: string[];
        is_commentable: boolean;
    },
    relationships: {
        author: {
            type: 'users'
            id: string,
        }
    },
}

