import type {RelationshipDTO} from "~/services/dtos/relationship_dto";

export interface PostDTO {
    type: 'posts',
    attributes: {
        title: string,
        text: string,
    },
    relationships: {
        author: {
            type: 'users'
            id: string,
        }
    },
    image: Blob | null// null or a Blob if provided
};

