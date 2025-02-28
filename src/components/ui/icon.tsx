import React, { useEffect, useRef } from 'react';
import { setIcon } from 'obsidian';

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  onClick?: () => void;
  title?: string;
}

/**
 * 封装 Obsidian 的 setIcon 功能的 React 组件
 */
export const Icon: React.FC<IconProps> = ({
  name,
  size,
  className = "",
  onClick,
  title,
}) => {
  const iconRef = useRef<HTMLDivElement>(null);

  // 当名称变化或组件加载时设置图标
  useEffect(() => {
    if (iconRef.current) {
      // setIcon 只接受两个参数
      setIcon(iconRef.current, name);

      // 如果需要调整大小，使用 CSS
      if (size && iconRef.current.firstChild) {
        // (iconRef.current.firstChild as HTMLElement).setAttribute('width', `${size}px`);
        // (iconRef.current.firstChild as HTMLElement).setAttribute('height', `${size}px`);
        (iconRef.current.firstChild as HTMLElement).style.width = `${size}px`;
        (iconRef.current.firstChild as HTMLElement).style.height = `${size}px`;
        iconRef.current.style.width = `${size}px`;
        iconRef.current.style.height = `${size}px`;
      }
    }
  }, [name, size]);

  return (
    <div
      ref={iconRef}
      className={`obsidian-icon ${className}`}
      onClick={onClick}
      title={title}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    />
  );
}; 