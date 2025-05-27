export interface PostUpdateRequestDTO {
    id: number;
    title: string;
    text: string;
    imagePath: Blob | null;
    parentId: number | null;
    tags: string[];
}