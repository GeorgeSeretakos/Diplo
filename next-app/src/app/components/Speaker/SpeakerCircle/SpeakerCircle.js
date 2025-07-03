'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";

const SpeakerCircle = ({ documentId, speakerName, imageUrl }) => {
  return (
    <Link href={`/speaker/${documentId}`} className="flex flex-col items-center text-center space-y-2">
      <div className="flex justify-center items-center w-24 h-24 rounded-full overflow-hidden bg-gray-300 relative">
        <Image
          src={imageUrl}
          alt={speakerName}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>
      <div className="text-white font-semibold text-sm leading-tight">
        {speakerName.split(" ").map((word, idx) => (
          <span key={idx} className="block">{word}</span>
        ))}
      </div>
    </Link>
  );
};

export default SpeakerCircle;
