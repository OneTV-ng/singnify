import {Theme} from '@/app/lib/types';



export const themes: Theme[] = [
  {
    id: 'default-light',
    name: 'Classic Light',
    primary: '#3B82F6',
    secondary: '#6B7280',
    background: '#FFFFFF',
    foreground: '#000000',
    accent: 'blue',
    baseColor: 'white',
    dark: false,
    componentShadow: 'shadow-md'
  },
  {
    id: 'default-dark',
    name: 'Dark Slate',
    primary: '#60A5FA',
    secondary: '#9CA3AF',
    background: '#1F2937',
    foreground: '#FFFFFF',
    accent: 'indigo',
    baseColor: 'black',
    dark: true,
    componentShadow: 'shadow-xl'
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    primary: '#2196F3',
    secondary: '#81D4FA',
    background: '#E3F2FD',
    foreground: '#0D47A1',
    accent: 'blue',
    baseColor: 'white',
    dark: false,
    componentShadow: 'shadow-lg'
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    primary: '#4CAF50',
    secondary: '#81C784',
    background: '#E8F5E9',
    foreground: '#1B5E20',
    accent: 'green',
    baseColor: 'white',
    dark: false,
    componentShadow: 'shadow-md'
  },
  {
    id: 'sunset-rouge',
    name: 'Sunset Rouge',
    primary: '#E91E63',
    secondary: '#F06292',
    background: '#FCE4EC',
    foreground: '#880E4F',
    accent: 'red',
    baseColor: 'white',
    dark: false,
    componentShadow: 'shadow-sm'
  },
  {
    id: 'midnight-purple',
    name: 'Midnight Purple',
    primary: '#9C27B0',
    secondary: '#BA68C8',
    background: '#F3E5F5',
    foreground: '#4A148C',
    accent: 'purple',
    baseColor: 'white',
    dark: false,
    componentShadow: 'shadow-md'
  },
  {
    id: 'desert-amber',
    name: 'Desert Amber',
    primary: '#FF9800',
    secondary: '#FFB74D',
    background: '#FFF3E0',
    foreground: '#E65100',
    accent: 'orange',
    baseColor: 'white',
    dark: false,
    componentShadow: 'shadow-sm'
  },
  {
    id: 'deep-night',
    name: 'Deep Night',
    primary: '#673AB7',
    secondary: '#9575CD',
    background: '#212121',
    foreground: '#FFFFFF',
    accent: 'indigo',
    baseColor: 'black',
    dark: true,
    componentShadow: 'shadow-xl'
  },
  {
    id: 'modern-charcoal',
    name: 'Modern Charcoal',
    primary: '#607D8B',
    secondary: '#90A4AE',
    background: '#ECEFF1',
    foreground: '#263238',
    accent: 'blue',
    baseColor: 'slate',
    dark: false,
    componentShadow: 'shadow-lg'
  },
  {
    id: 'warm-earth',
    name: 'Warm Earth',
    primary: '#795548',
    secondary: '#A1887F',
    background: '#EFEBE9',
    foreground: '#3E2723',
    accent: 'orange',
    baseColor: 'stone',
    dark: false,
    componentShadow: 'shadow-md'
  }
];