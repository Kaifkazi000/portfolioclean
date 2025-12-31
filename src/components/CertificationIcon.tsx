import React from "react";

interface CertificationIconProps {
  name: string;
  link: string;
  imageSrc: string; // ✅ PNG image URL or local path
}

export default function CertificationIcon({ name, link, imageSrc }: CertificationIconProps) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="w-12 h-12 sm:w-20 sm:h-20 p-2 rounded-lg hover:scale-105 transition-transform shadow-md bg-white"
    >
      <img
        src={imageSrc}
        alt={name}
        className="w-full h-full object-contain"
      />
    </a>
  );
}
