"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Post, Props } from "@/app/posts_create/_components/types";

export default function PostsList({ posts }: Props) {
    const router = useRouter();
    const [localPosts, setLocalPosts] = useState<Post[]>([]);
    const [hydrated, setHydrated] = useState(false);

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openSuccessModal, setOpenSuccessModal] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

    useEffect(() => {
        setLocalPosts(posts);
        setHydrated(true);
    }, [posts]);

    const confirmDelete = (id: string) => {
        setSelectedPostId(id);
        setOpenDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!selectedPostId) return;

        try {
            const res = await fetch(`/api/posts/${selectedPostId}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Falha ao deletar post");

            setLocalPosts(prev => prev.filter(post => post.id !== selectedPostId));
            setOpenDeleteModal(false);
            setOpenSuccessModal(true);
            setSelectedPostId(null);
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Erro ao excluir post.");
        }
    };

    const handleEdit = (id: string) => router.push(`/posts/edit/${id}?page=posts`);

    if (!hydrated) return null;

    return (
        <>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {localPosts.length === 0 && (
                    <p className="text-center text-slate-500 col-span-full">
                        Você ainda não criou nenhum post.
                    </p>
                )}

                {localPosts.map(post => (
                    <Card key={post.id} className="shadow-md border border-slate-200 flex flex-col">
                        <CardHeader className={`flex justify-between items-start ${
                          post.titleAlignment === "center" ? "text-center" : "text-left"
                        }`}>
                            <div>
                                <CardTitle>{post.title}</CardTitle>
                                <CardDescription>
                                    {format(new Date(post.createdAt), "dd/MM/yyyy 'às' HH:mm")}
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => router.push(`/posts/view/${post.id}?page=posts`)}>
                                    Visualizar
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleEdit(post.id)}>
                                    Editar
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => confirmDelete(post.id)}>
                                    Excluir
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className={`space-y-2 flex flex-col flex-1 ${
                          post.imagePosition === "left" ? "sm:flex-row" : ""
                        } ${
                          post.imagePosition === "right" ? "sm:flex-row-reverse" : ""
                        }`}>
                            {post.image && (
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className={`w-full h-48 object-cover rounded-md ${
                                      post.imagePosition === "left" || post.imagePosition === "right"
                                        ? "sm:w-1/2 sm:h-auto" : ""
                                    }`}
                                />
                            )}
                            <div
                                className="text-slate-700 mt-2 flex-1 overflow-hidden text-ellipsis"
                                style={{ maxHeight: '100px' }}
                                dangerouslySetInnerHTML={{ __html: post.content || "" }}
                            />
                            <Button variant="link" onClick={() => router.push(`/posts/view/${post.id}`)} className="p-0 justify-start">
                                Ver mais
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>


            {/* Modal de confirmação */}
            <Dialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
                <DialogContent className="p-6 max-w-sm rounded-lg bg-white shadow-lg">
                    <DialogHeader>
                        <DialogTitle>Excluir post</DialogTitle>
                        <DialogDescription>Esta ação é irreversível.</DialogDescription>
                    </DialogHeader>
                    <p className="mb-6 text-slate-700">
                        Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.
                    </p>
                    <DialogFooter className="flex justify-end gap-2">
                        <DialogClose asChild>
                            <Button variant="outline">Cancelar</Button>
                        </DialogClose>
                        <Button variant="destructive" onClick={handleDelete}>
                            Excluir
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal de sucesso */}
            <Dialog open={openSuccessModal} onOpenChange={setOpenSuccessModal}>
                <DialogContent className="p-6 max-w-sm rounded-lg bg-white shadow-lg">
                    <DialogHeader>
                        <DialogTitle>Post excluído!</DialogTitle>
                    </DialogHeader>
                    <p className="mb-6 text-slate-700">O post foi excluído com sucesso.</p>
                    <DialogFooter className="flex justify-end">
                        <DialogClose asChild>
                            <Button onClick={() => setOpenSuccessModal(false)}>Fechar</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
