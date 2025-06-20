import React from 'react';

export interface MemberCardProps {
  name: string;
  position: string;
  photo: string;
  isPrimary?: boolean;
}

const MemberCard: React.FC<MemberCardProps> = ({ name, position, photo, isPrimary = false }) => {
  return (
    <div className="text-center transform hover:scale-105 transition-transform duration-300">
      <img
        src={photo}
        alt={`Foto ${name}`}
        className={`w-40 h-40 md:w-48 md:h-48 mx-auto rounded-full object-cover shadow-lg border-4 ${
          isPrimary ? 'border-red-700' : 'border-gray-300'
        }`}
        onError={(e) => {
          (e.target as HTMLImageElement).onerror = null;
          (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/cccccc/ffffff?text=Error';
        }}
      />
      <h4 className="mt-4 text-xl font-bold text-gray-800">{name}</h4>
      <p className="text-gray-500">{position}</p>
    </div>
  );
};

export default MemberCard;
