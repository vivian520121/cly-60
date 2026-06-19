import type { BookTemplate } from '../types';

export interface TemplateStyle {
  name: string;
  pageBg: string;
  pageBgGradient: string;
  textColor: string;
  textColorLight: string;
  accentColor: string;
  titleFont: string;
  bodyFont: string;
  contentClass: string;
}

export const templateStyles: Record<BookTemplate, TemplateStyle> = {
  ancient: {
    name: '泛黄古书',
    pageBg: 'bg-amber-100',
    pageBgGradient: 'bg-gradient-to-br from-amber-100 via-amber-50 to-yellow-100',
    textColor: 'text-amber-900',
    textColorLight: 'text-amber-700',
    accentColor: 'text-amber-600',
    titleFont: 'font-serif',
    bodyFont: 'font-serif',
    contentClass: 'leading-relaxed',
  },
  notebook: {
    name: '横线笔记本',
    pageBg: 'bg-slate-50',
    pageBgGradient: 'bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50',
    textColor: 'text-slate-800',
    textColorLight: 'text-slate-600',
    accentColor: 'text-blue-600',
    titleFont: 'font-sans',
    bodyFont: 'font-sans',
    contentClass: 'notebook-lines leading-8',
  },
  newspaper: {
    name: '报纸剪报',
    pageBg: 'bg-stone-100',
    pageBgGradient: 'bg-gradient-to-br from-stone-100 via-gray-100 to-zinc-100',
    textColor: 'text-gray-900',
    textColorLight: 'text-gray-700',
    accentColor: 'text-red-700',
    titleFont: 'font-serif',
    bodyFont: 'font-serif',
    contentClass: 'newspaper-column leading-snug text-sm',
  },
  letter: {
    name: '信笺',
    pageBg: 'bg-gray-50',
    pageBgGradient: 'bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50',
    textColor: 'text-slate-900',
    textColorLight: 'text-slate-600',
    accentColor: 'text-blue-800',
    titleFont: 'font-kai',
    bodyFont: 'font-kai',
    contentClass: 'letter-header-line leading-7',
  },
};

export const templateColors: Record<BookTemplate, { primary: string; secondary: string }> = {
  ancient: { primary: '#f5e6c8', secondary: '#4a3728' },
  notebook: { primary: '#faf8f5', secondary: '#2c3e50' },
  newspaper: { primary: '#f0ede8', secondary: '#1a1a1a' },
  letter: { primary: '#fdfbf7', secondary: '#1e3a5f' },
};
