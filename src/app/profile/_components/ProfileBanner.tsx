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
    <div className="relative w-full">
        <div className="absolute inset-0 bg-black/40 z-0" />
      <div
        className="relative flex flex-col w-full px-4 sm:px-6 lg:px-8 items-center gap-4 border-b pb-6 text-center mx-auto"
        style={{
          backgroundImage: `url(${imageBanner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}>

        <button
          onClick={() => {setShowModal(true); setBanner(true);}}
           className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 p-2 bg-white/80 rounded-full hover:bg-white shadow focus:outline-none"
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
              className="rounded-full object-cover border-4 border-primary shadow-md"
              sizes="(max-width: 768px) 100vw, 96px"
              placeholder="blur"
              blurDataURL="/avatar-blur.png"
            />
            <button
            onClick={() => {setShowModal(true); setBanner(false);}}
            className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full hover:bg-white shadow"
            >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z" />
            </svg>
            </button>
          </div>
          <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-white">{name}</h1>
          <p className="text-sm sm:text-base text-white/80">{email}</p>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Editar {banner === true ? "Banner":"Avatar"}</h2>
            <BannerUploader banner={banner}/>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
