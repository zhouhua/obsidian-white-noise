import React, { useEffect, useRef } from 'react';
import { SliderComponent } from 'obsidian';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  id?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * 封装 Obsidian 的 SliderComponent 的 React 组件
 */
export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
  id,
  disabled = false,
  className = "",
}) => {
  // 容器 ref
  const containerRef = useRef<HTMLElement | null>(null);
  // 使用 ref 追踪 SliderComponent 实例
  const sliderRef = useRef<SliderComponent | null>(null);

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

    // 创建 SliderComponent 实例
    const slider = new SliderComponent(container);

    // 设置滑块属性
    slider.setLimits(min, max, step);
    slider.setValue(value);
    slider.onChange(onChange);

    // 如果禁用，添加禁用类
    if (disabled) {
      container.classList.add('is-disabled');
    }

    // 保存引用
    sliderRef.current = slider;

    // 在组件卸载时清理
    return () => {
      if (containerRef.current && container.parentNode === containerRef.current) {
        containerRef.current.removeChild(container);
      }
      sliderRef.current = null;
    };
  }, []);

  // 响应值变化
  useEffect(() => {
    if (sliderRef.current && sliderRef.current.getValue() !== value) {
      sliderRef.current.setValue(value);
    }
  }, [value]);

  // 响应最小值、最大值、步长变化
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.setLimits(min, max, step);
    }
  }, [min, max, step]);

  // 响应禁用状态变化
  useEffect(() => {
    if (sliderRef.current && containerRef.current) {
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

  // 返回一个空的 span 作为容器的父元素
  return <span ref={containerRef} />;
}; 