import React from 'react';
import { 
  Stethoscope, 
  Brain, 
  HeartPulse, 
  Activity, 
  Baby, 
  Sparkles, 
  Bone, 
  Headphones, 
  Apple, 
  Smile,
  LucideIcon
} from 'lucide-react';
import { SpecialtyId } from '../../types';

interface SpecialtyIconProps {
  id?: SpecialtyId | string;
  name?: string;
  className?: string;
}

export const SpecialtyIcon: React.FC<SpecialtyIconProps> = ({ id, name, className = 'w-5 h-5' }) => {
  const normalized = (id || name || '').toLowerCase();

  let IconComponent: LucideIcon = Stethoscope;

  if (normalized.includes('neuro') || normalized.includes('brain')) {
    IconComponent = Brain;
  } else if (normalized.includes('cardio') || normalized.includes('heart')) {
    IconComponent = HeartPulse;
  } else if (normalized.includes('gyne') || normalized.includes('women')) {
    IconComponent = Activity;
  } else if (normalized.includes('pedia') || normalized.includes('child')) {
    IconComponent = Baby;
  } else if (normalized.includes('derma') || normalized.includes('skin')) {
    IconComponent = Sparkles;
  } else if (normalized.includes('ortho') || normalized.includes('bone')) {
    IconComponent = Bone;
  } else if (normalized.includes('ent') || normalized.includes('ear')) {
    IconComponent = Headphones;
  } else if (normalized.includes('gastro') || normalized.includes('digest')) {
    IconComponent = Apple;
  } else if (normalized.includes('psych') || normalized.includes('mental')) {
    IconComponent = Smile;
  }

  return <IconComponent className={className} />;
};
