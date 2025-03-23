import { type ClassValue } from 'clsx';
/**
 * 合并 className 工具函数
 * 结合了 clsx 和 tailwind-merge 的功能
 * 可以智能地合并多个类名，包括条件类名，并自动处理 Tailwind 类名的冲突
 */
export declare function cn(...inputs: ClassValue[]): string;
