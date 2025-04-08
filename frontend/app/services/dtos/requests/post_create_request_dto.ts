export interface PostCreateRequestDTO {
    title: string;
    text: string;
    image: Blob | null,
    parentId: string | null;
}