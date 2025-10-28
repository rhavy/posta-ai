export interface Post {
    id: string;
    title: string;
    content: string;
    image?: string | null;
    imagePosition?: "top" | "left" | "right" | null;
    titleAlignment?: "left" | "center" | null;
    createdAt: Date | string;
}

export interface Props {
    posts: Post[];
}