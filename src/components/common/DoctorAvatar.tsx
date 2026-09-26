import React, { useState } from 'react';

interface DoctorAvatarProps {
  name: string;
  initials: string;
  avatarUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const DoctorAvatar: React.FC<DoctorAvatarProps> = ({
  name,
  initials,
  avatarUrl,
  size = 'md',
  className = ''
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-20 h-20 text-2xl'
  };

  const currentSize = sizeClasses[size];

  if (avatarUrl && !imageError) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        onError={() => setImageError(true)}
        className={`${currentSize} rounded-full object-cover border-2 border-blue-500/30 shadow-md ${className}`}
      />
    );
  }

  return (
    <div
      className={`${currentSize} rounded-full bg-[#182846] text-blue-400 font-bold flex items-center justify-center border-2 border-blue-500/30 shadow-inner select-none ${className}`}
    >
      {initials}
    </div>
  );
};
