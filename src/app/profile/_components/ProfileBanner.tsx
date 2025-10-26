// app/profile/_components/ProfileBanner.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { BannerUploader } from "./BannerUploader";

export function ProfileBanner({ imageBanner, imageUrl, name, email }: {
  imageBanner: string;
  imageUrl: string;
  name: string;
  email: string;
}) {
  const [showModal, setShowModal] = useState(false);
  const [banner, setBanner] = useState(false);

  return (
    <div className="relative w-full group">
      <div
        className="relative flex flex-col w-full px-4 sm:px-6 lg:px-8 items-center gap-4 border-b pb-6 text-center mx-auto"
        style={{
          backgroundImage: `url(${imageBanner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20 z-0" />

        <button
          onClick={() => {setShowModal(true); setBanner(true);}}
          className="absolute top-4 right-4 z-20 p-2 bg-white/80 rounded-full hover:bg-white shadow focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z" />
          </svg>
        </button>

        <div className="relative z-10 max-w-[800px] w-full py-8">
          <div className="relative w-24 h-24 mx-auto">
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="rounded-full object-cover border-4 border-primary shadow-lg"
              sizes="(max-width: 768px) 100vw, 96px"
              placeholder="blur"
              blurDataURL="/avatar-blur.png"
            />
            <button
              onClick={() => {setShowModal(true); setBanner(false);}}
              className="absolute bottom-0 right-0 z-10 p-2 bg-white/80 rounded-full hover:bg-white shadow focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z" />
              </svg>
            </button>
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-white tracking-tight">{name}</h1>
          <p className="text-sm sm:text-base text-white/80">{email}</p>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 scale-95 group-hover:scale-100">
            <h2 className="text-lg font-semibold mb-4">Editar {banner ? "Banner" : "Avatar"}</h2>
            <BannerUploader banner={banner} />
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 w-full"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
