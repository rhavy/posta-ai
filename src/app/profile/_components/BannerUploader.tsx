'use client';

import { useState } from 'react';
import axios from 'axios';

export function BannerUploader({ banner }: {
  banner: boolean;
}) {
  if(banner === true ){
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleUpload(file?: File) {
      if (!file) return;

      // Preview
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);

      // Upload
      const formData = new FormData();
      formData.append('banner', file);

      try {
        setLoading(true);
        await axios.post('/api/upload-banner', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        window.location.reload();
      } catch (error: any) {
        console.error('Erro no upload:', error.message);
      } finally {
        setLoading(false);
      }
    }

    return (
      <div className="mt-6 space-y-3">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleUpload(e.target.files?.[0])}
          className="block text-sm"
        />
        {preview && (
          <img
            src={preview}
            alt="Preview do banner"
            className="rounded-md w-full max-w-md mx-auto shadow"
          />
        )}
        {loading && <p className="text-sm text-muted-foreground">⏳ Enviando imagem...</p>}
      </div>
    );
  }else{

    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleUpload(file?: File) {
      if (!file) return;

      // Preview
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);

      // Upload
      const formData = new FormData();
      formData.append('image', file);

      try {
        setLoading(true);
        await axios.post('/api/upload-banner', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        window.location.reload();
      } catch (error: any) {
        console.error('Erro no upload:', error.message);
      } finally {
        setLoading(false);
      }
    }

    return (
      <div className="mt-6 space-y-3">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleUpload(e.target.files?.[0])}
          className="block text-sm"
        />
        {preview && (
          <img
            src={preview}
            alt="Preview do banner"
            className="rounded-md w-full max-w-md mx-auto shadow"
          />
        )}
        {loading && <p className="text-sm text-muted-foreground">⏳ Enviando imagem...</p>}
      </div>
    );

  }
}
