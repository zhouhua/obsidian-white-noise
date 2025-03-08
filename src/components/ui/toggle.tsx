import React, { useEffect, useRef } from 'react';
import { ToggleComponent } from 'obsidian';

interface ToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  id?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * 封装 Obsidian 的 ToggleComponent 的 React 组件
 */
export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  id,
  disabled = false,
  className = "",
}) => {
  // 容器 ref
  const containerRef = useRef<HTMLElement | null>(null);
  // 使用 ref 追踪 ToggleComponent 实例
  const toggleRef = useRef<ToggleComponent | null>(null);

  // 组件初始化和清理
  useEffect(() => {
    // 创建一个新的容器元素，而不是使用 React 创建的 div
    const container = document.createElement('div');
    container.className = className;

    // 将容器添加到 DOM
    if (containerRef.current) {
      containerRef.current.appendChild(container);
    }

    // 创建 ToggleComponent 实例
    const toggle = new ToggleComponent(container);
    toggle.setValue(checked);
    toggle.onChange(onChange);

    if (id) {
      container.dataset.id = id;
      toggle.toggleEl.firstElementChild?.setAttribute('id', id);
    }

    // 保存引用
    toggleRef.current = toggle;

    // 在组件卸载时清理
    return () => {
      if (containerRef.current && container.parentNode === containerRef.current) {
        containerRef.current.removeChild(container);
      }
      toggleRef.current = null;
    };
  }, []);

  // 响应 checked 属性变化
  useEffect(() => {
    if (toggleRef.current) {
      toggleRef.current.setValue(checked);
    }
  }, [checked]);

  // 响应 disabled 属性变化
  useEffect(() => {
    if (toggleRef.current && toggleRef.current.toggleEl) {
      if (disabled) {
        toggleRef.current.toggleEl.classList.add('is-disabled');
      } else {
        toggleRef.current.toggleEl.classList.remove('is-disabled');
      }
    }
  }, [disabled]);

  // 返回一个空的 span 作为容器的父元素
  return <span ref={containerRef} />;
}; 