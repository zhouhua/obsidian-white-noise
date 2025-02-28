import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

export class ReactRenderer {
  private static instances: Map<string, ReactDOM.Root> = new Map();

  static render(
    id: string,
    element: React.ReactNode,
    container: HTMLElement
  ): void {
    this.unmount(id);

    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        {element}
      </React.StrictMode>
    );

    this.instances.set(id, root);
  }

  static unmount(id: string): void {
    const root = this.instances.get(id);
    if (root) {
      root.unmount();
      this.instances.delete(id);
    }
  }

  static unmountAll(): void {
    for (const [_, root] of this.instances.entries()) {
      root.unmount();
    }
    this.instances.clear();
  }
}