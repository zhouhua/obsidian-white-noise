import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

// React 组件容器管理器
export class ReactRenderer {
  private static instances: Map<string, ReactDOM.Root> = new Map();

  // 将 React 组件渲染到指定的容器中
  static render(
    id: string,
    element: React.ReactNode,
    container: HTMLElement
  ): void {
    // 清理之前的实例（如果存在）
    this.unmount(id);

    // 创建新的 root 并渲染
    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        {element}
      </React.StrictMode>
    );

    // 保存实例以便之后清理
    this.instances.set(id, root);
  }

  // 卸载指定 ID 的 React 组件
  static unmount(id: string): void {
    const root = this.instances.get(id);
    if (root) {
      root.unmount();
      this.instances.delete(id);
    }
  }

  // 卸载所有 React 组件
  static unmountAll(): void {
    for (const [_, root] of this.instances.entries()) {
      root.unmount();
    }
    this.instances.clear();
  }
}