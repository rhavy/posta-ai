
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ImageIcon,
  LinkIcon,
  SendIcon,
  TypeIcon,
  AlignLeft,
  AlignCenter,
  Bold,
  Italic,
  List,
  LayoutGrid,
  PanelLeft,
  PanelRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { Post } from "@/app/posts_create/_components/types";

// EditorContent carregado dinamicamente (client only)
const EditorContent = dynamic(
  () => import("@tiptap/react").then((mod) => mod.EditorContent),
  { ssr: false }
);

// extensões
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { useEditor } from "@tiptap/react";

interface EditPostFormProps {
  post: Post;
  link: string;
}

export default function EditPostForm({ post, link }: EditPostFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(post.title);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(post.image || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // 🧠 NOVOS ESTADOS
  const [imagePosition, setImagePosition] = useState<"top" | "left" | "right">(post.imagePosition || "top");
  const [titleAlign, setTitleAlign] = useState<"left" | "center">(post.titleAlignment || "left");

  // Editor Tiptap
  const MAX_CHARS = 5000;
  const [charCount, setCharCount] = useState(post.content?.length || 0);

  const editor = useEditor({
    extensions: [StarterKit, Underline, Link],
    content: post.content || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[200px] max-h-[300px] overflow-y-auto border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white text-slate-800",
      },
    },
    onUpdate({ editor }) {
      const text = editor.getText();
      if (text.length > MAX_CHARS) {
        editor.commands.setContent(text.slice(0, MAX_CHARS));
        setCharCount(MAX_CHARS);
      } else {
        setCharCount(text.length);
      }
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    event.target.value = "";
  };

  const handleImageUploadClick = () => fileInputRef.current?.click();

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  const addLink = () => {
    const url = window.prompt("Cole o link:");
    if (url) editor?.chain().focus().setLink({ href: url }).run();
  };

  const handleSubmit = async () => {
    if (!title.trim() || !editor?.getHTML().trim()) {
      alert("Por favor, preencha o título e o texto/reflexão.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", editor.getHTML());
      formData.append("imagePosition", imagePosition);
      formData.append("titleAlignment", titleAlign);

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const res = await fetch(`/api/posts/${post.id}`,
       {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Resposta da API:", text);
        throw new Error("Erro ao atualizar post");
      }

      setShowModal(true);
    } catch (error) {
      console.error(error);
      alert("Falha ao atualizar o post. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="shadow-lg border border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <TypeIcon className="text-green-400 w-5 h-5" />
              Editar Post
            </CardTitle>
            <p className="text-sm text-slate-500">
              Faça as alterações necessárias no seu post.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Título</label>
              <Input
                placeholder="Digite o título do seu post..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`${
                  titleAlign === "center" ? "text-center" : "text-left"
                } transition-all`}
              />
            </div>

            {/* 🔘 Alinhamento do título */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Alinhamento do título:</span>
              <div className="flex gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant={titleAlign === "left" ? "default" : "outline"}
                  onClick={() => setTitleAlign("left")}
                >
                  <AlignLeft size={16} />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={titleAlign === "center" ? "default" : "outline"}
                  onClick={() => setTitleAlign("center")}
                >
                  <AlignCenter size={16} />
                </Button>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <ImageIcon className="w-4 h-4 text-green-400" /> Imagem
              </label>

              <div className="flex items-center gap-2">
                {!preview && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleImageUploadClick}
                    className="flex items-center gap-1"
                  >
                    <ImageIcon size={16} /> <span className="text-xs">Upload</span>
                  </Button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {preview && (
                <div className="mt-3 relative w-64 h-40 rounded-lg overflow-hidden border border-slate-200">
                  <img src={preview} alt="Selecionada" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"
                    title="Remover imagem"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* 🔘 Posição da imagem */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Posição da imagem:</span>
              <div className="flex gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant={imagePosition === "top" ? "default" : "outline"}
                  onClick={() => setImagePosition("top")}
                >
                  <LayoutGrid size={16} /> {/* imagem acima */}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={imagePosition === "left" ? "default" : "outline"}
                  onClick={() => setImagePosition("left")}
                >
                  <PanelLeft size={16} />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={imagePosition === "right" ? "default" : "outline"}
                  onClick={() => setImagePosition("right")}
                >
                  <PanelRight size={16} />
                </Button>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <AlignLeft className="w-4 h-4 text-purple-400" /> Texto / Reflexão
              </label>
              {editor && (
                <div className="flex flex-wrap items-center gap-2 border border-slate-300 rounded-t-lg bg-slate-50 p-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive("bold") ? "bg-slate-200" : ""}
                  >
                    <Bold size={16} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive("italic") ? "bg-slate-200" : ""}
                  >
                    <Italic size={16} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive("bulletList") ? "bg-slate-200" : ""}
                  >
                    <List size={16} />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={addLink}>
                    <LinkIcon size={16} />
                  </Button>
                </div>
              )}
              <div className="border border-slate-300 border-t-0 rounded-b-lg">
                <EditorContent editor={editor} />
              </div>
              <div className="text-right text-sm text-slate-500 mt-1">
                {charCount} / {MAX_CHARS} caracteres
              </div>

            </div>

            <div className="pt-4 flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
              >
                <SendIcon className="w-4 h-4" />
                {isSubmitting ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full text-center space-y-4">
            <h3 className="text-lg font-semibold">Post atualizado com sucesso!</h3>
            <Button onClick={() => router.push(link)} className="bg-green-500 hover:bg-green-600 text-white">
              Fechar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
