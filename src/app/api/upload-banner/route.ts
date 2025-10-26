import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    console.log('📥 Upload de imagem iniciado');

    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      console.error('❌ Sessão não encontrada');
      return new Response('Unauthorized', { status: 401 });
    }

    const formData = await req.formData();
    const banner = formData.get('banner');
    const image = formData.get('image');

    const file = banner ?? image;
    const fieldType = banner ? 'banner' : image ? 'image' : null;

    if (!file || !fieldType || typeof file.name !== 'string' || typeof file.arrayBuffer !== 'function') {
      console.error('⚠️ Nenhum arquivo válido encontrado');
      return new Response('No valid image uploaded', { status: 400 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase();
    const allowedExt = ['jpg', 'jpeg', 'png', 'webp'];
    if (!ext || !allowedExt.includes(ext)) {
      console.error(`🚫 Extensão não permitida: .${ext}`);
      return new Response('Unsupported file type', { status: 415 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: 'image', folder: 'profile-media' },
        (err, result) => {
          if (err || !result?.secure_url) {
            console.error('💥 Erro no Cloudinary:', err || result);
            return reject(new Error('Cloudinary upload failed'));
          }
          resolve(result);
        }
      ).end(buffer);
    });

    const { secure_url: originalUrl } = uploadResult as { secure_url: string };

    const transformedUrl = originalUrl.replace(
      '/upload/',
      '/upload/w_600,h_400,c_fill,e_grayscale,r_20,f_auto,q_auto/'
    );

    if (fieldType === 'banner') {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { banner: transformedUrl },
        // create: { id: session.user.id, banner: transformedUrl },
      });
      console.log('✅ Banner atualizado');
    } else if (fieldType === 'image') {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { image: transformedUrl },
      });
      console.log('✅ Avatar atualizado');
    }

    return new Response('Upload concluído com sucesso!', { status: 200 });

  } catch (error: any) {
    console.error('❌ Erro interno:', error.message);
    console.error(error.stack);
    return new Response('Internal server error', { status: 500 });
  }
}
