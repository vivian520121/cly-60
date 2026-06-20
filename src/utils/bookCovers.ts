import type { CoverImage, BookTemplate } from '../types';

export interface BuiltinCover {
  id: string;
  name: string;
  gradient: string;
  pattern?: string;
  borderColor: string;
  textColor: string;
}

export const builtinCovers: BuiltinCover[] = [
  {
    id: 'cover-ancient-1',
    name: '古籍蓝绫',
    gradient: 'linear-gradient(135deg, #1a365d 0%, #2c5282 30%, #2b6cb0 70%, #1a365d 100%)',
    pattern: `repeating-linear-gradient(
      90deg,
      transparent,
      transparent 2px,
      rgba(255, 215, 0, 0.1) 2px,
      rgba(255, 215, 0, 0.1) 4px
    )`,
    borderColor: '#d4af37',
    textColor: '#ffd700',
  },
  {
    id: 'cover-ancient-2',
    name: '藏经典籍',
    gradient: 'linear-gradient(135deg, #5a1818 0%, #8b2323 30%, #a52a2a 70%, #5a1818 100%)',
    pattern: `repeating-linear-gradient(
      45deg,
      transparent,
      transparent 3px,
      rgba(255, 215, 0, 0.08) 3px,
      rgba(255, 215, 0, 0.08) 6px
    )`,
    borderColor: '#d4af37',
    textColor: '#ffd700',
  },
  {
    id: 'cover-ancient-3',
    name: '墨香书韵',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #0f3460 70%, #1a1a2e 100%)',
    pattern: `radial-gradient(
      circle at 50% 50%,
      rgba(255, 215, 0, 0.05) 0%,
      transparent 50%
    )`,
    borderColor: '#c9a227',
    textColor: '#e6c200',
  },
  {
    id: 'cover-ancient-4',
    name: '翠竹书卷',
    gradient: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 30%, #40916c 70%, #1b4332 100%)',
    pattern: `repeating-linear-gradient(
      0deg,
      transparent,
      transparent 4px,
      rgba(255, 255, 255, 0.03) 4px,
      rgba(255, 255, 255, 0.03) 8px
    )`,
    borderColor: '#95d5b2',
    textColor: '#d8f3dc',
  },
  {
    id: 'cover-ancient-5',
    name: '秋叶黄卷',
    gradient: 'linear-gradient(135deg, #5c3d2e 0%, #8b5a2b 30%, #b8860b 70%, #5c3d2e 100%)',
    pattern: `linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.02) 0%,
      transparent 50%,
      rgba(0, 0, 0, 0.05) 100%
    )`,
    borderColor: '#daa520',
    textColor: '#ffeb99',
  },
  {
    id: 'cover-ancient-6',
    name: '紫檀香籍',
    gradient: 'linear-gradient(135deg, #3d1f1f 0%, #5c2323 30%, #7c3030 70%, #3d1f1f 100%)',
    pattern: `radial-gradient(
      ellipse at 30% 20%,
      rgba(255, 200, 100, 0.08) 0%,
      transparent 40%
    )`,
    borderColor: '#cd853f',
    textColor: '#ffdab9',
  },
  {
    id: 'cover-ancient-7',
    name: '石青典藏',
    gradient: 'linear-gradient(135deg, #0d2b45 0%, #1e4a6d 30%, #2c7a9e 70%, #0d2b45 100%)',
    pattern: `repeating-linear-gradient(
      60deg,
      transparent,
      transparent 5px,
      rgba(255, 255, 255, 0.02) 5px,
      rgba(255, 255, 255, 0.02) 10px
    )`,
    borderColor: '#87ceeb',
    textColor: '#e0f0ff',
  },
  {
    id: 'cover-ancient-8',
    name: '赭石古卷',
    gradient: 'linear-gradient(135deg, #4a2c0a 0%, #6b4423 30%, #8b5a3c 70%, #4a2c0a 100%)',
    pattern: `radial-gradient(
      circle at 80% 80%,
      rgba(255, 220, 150, 0.06) 0%,
      transparent 60%
    )`,
    borderColor: '#d2691e',
    textColor: '#ffe4b5',
  },
];

export const getCoverById = (id: string): BuiltinCover | undefined => {
  return builtinCovers.find((cover) => cover.id === id);
};

export const getCoverStyle = (cover: CoverImage): React.CSSProperties => {
  if (cover.source === 'upload') {
    return {
      backgroundImage: `url(${cover.value})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  }

  const builtinCover = getCoverById(cover.value);
  if (builtinCover) {
    return {
      background: builtinCover.gradient,
    };
  }

  return {
    background: 'linear-gradient(135deg, #8b4513 0%, #a0522d 50%, #8b4513 100%)',
  };
};

export const getCoverPattern = (cover: CoverImage): string => {
  if (cover.source === 'upload') return '';
  const builtinCover = getCoverById(cover.value);
  return builtinCover?.pattern || '';
};

export const getCoverTextColor = (cover: CoverImage): string => {
  if (cover.source === 'upload') return '#ffffff';
  const builtinCover = getCoverById(cover.value);
  return builtinCover?.textColor || '#ffd700';
};

export const getCoverBorderColor = (cover: CoverImage): string => {
  if (cover.source === 'upload') return 'rgba(255, 255, 255, 0.3)';
  const builtinCover = getCoverById(cover.value);
  return builtinCover?.borderColor || '#d4af37';
};

export const templateNames: Record<BookTemplate, string> = {
  ancient: '泛黄古书',
  notebook: '横线笔记',
  newspaper: '报纸剪报',
  letter: '雅致信笺',
};

export const templatePreviews: Record<BookTemplate, string> = {
  ancient: 'linear-gradient(135deg, #f5e6c8 0%, #e8d4a8 100%)',
  notebook: 'linear-gradient(135deg, #faf8f5 0%, #f0ebe3 100%)',
  newspaper: 'linear-gradient(135deg, #f0ede8 0%, #e0ddd8 100%)',
  letter: 'linear-gradient(135deg, #fdfbf7 0%, #f5f0e8 100%)',
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};
