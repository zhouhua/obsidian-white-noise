import React, { useEffect, useRef } from 'react';
import { DropdownComponent } from 'obsidian';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  id?: string;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

/**
 * 封装 Obsidian 的 DropdownComponent 的 React 组件
 */
export const Dropdown: React.FC<DropdownProps> = ({
  value,
  options,
  onChange,
  id,
  disabled = false,
  className = "",
  placeholder,
}) => {
  // 容器 ref
  const containerRef = useRef<HTMLElement | null>(null);
  // 使用 ref 追踪 DropdownComponent 实例
  const dropdownRef = useRef<DropdownComponent | null>(null);

  // 组件初始化和清理
  useEffect(() => {
    // 创建一个新的容器元素
    const container = document.createElement('div');
    container.className = className;
    if (id) container.dataset.id = id;

    // 将容器添加到 DOM
    if (containerRef.current) {
      containerRef.current.appendChild(container);
    }

    // 创建 DropdownComponent 实例
    const dropdown = new DropdownComponent(container);

    // 添加选项
    options.forEach(option => {
      dropdown.addOption(option.value, option.label);
    });

    // 设置初始值
    dropdown.setValue(value);

    // 设置占位符文本（如果相关API存在）
    if (placeholder && 'selectEl' in dropdown) {
      const selectEl = dropdown.selectEl as HTMLSelectElement;
      selectEl.setAttribute('placeholder', placeholder);
    }

    // 设置变更处理器
    dropdown.onChange(onChange);

    // 如果禁用，添加禁用类
    if (disabled) {
      container.classList.add('is-disabled');
    }

    // 保存引用
    dropdownRef.current = dropdown;

    // 在组件卸载时清理
    return () => {
      if (containerRef.current && container.parentNode === containerRef.current) {
        containerRef.current.removeChild(container);
      }
      dropdownRef.current = null;
    };
  }, []);

  // 响应选项变化
  useEffect(() => {
    if (dropdownRef.current) {
      // 清除所有选项
      const selectEl = dropdownRef.current.selectEl;
      Array.from(selectEl.options).forEach(() => {
        selectEl.remove(0);
      });

      // 添加新选项
      options.forEach(option => {
        dropdownRef.current?.addOption(option.value, option.label);
      });

      // 重新设置值
      dropdownRef.current.setValue(value);
    }
  }, [options]);

  // 响应值变化
  useEffect(() => {
    if (dropdownRef.current && dropdownRef.current.getValue() !== value) {
      dropdownRef.current.setValue(value);
    }
  }, [value]);

  // 响应禁用状态变化
  useEffect(() => {
    if (dropdownRef.current && containerRef.current) {
      const container = containerRef.current.firstChild as HTMLElement;
      if (container) {
        if (disabled) {
          container.classList.add('is-disabled');
        } else {
          container.classList.remove('is-disabled');
        }
      }
    }
  }, [disabled]);

  // 响应占位符变化
  useEffect(() => {
    if (dropdownRef.current && placeholder && 'selectEl' in dropdownRef.current) {
      const selectEl = dropdownRef.current.selectEl as HTMLSelectElement;
      selectEl.setAttribute('placeholder', placeholder);
    }
  }, [placeholder]);

  // 返回一个空的 span 作为容器的父元素
  return <span ref={containerRef} />;
}; 