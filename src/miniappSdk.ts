// src/miniappSdk.ts
export type MiniResult<T=any> = { ok: boolean; data?: T; error?: string };

declare global {
  interface Window {
    miniapp?: {
      invoke: (method: string, params?: any) => Promise<MiniResult>;
    };
  }
}

const ensure = () => {
  if (!window.miniapp?.invoke) throw new Error('MiniApp bridge not available');
  return window.miniapp;
};

export const mini = {
  getStatus: () => ensure().invoke('getStatus'),
  connectChrome: (settings: any) => ensure().invoke('connectChrome', settings),
  closeBrowser: () => ensure().invoke('closeBrowser'),
  driver: {
    navigate: (url: string) => ensure().invoke('driver:navigate', { url }),
    getUrl: () => ensure().invoke('driver:getUrl'),
    getTitle: () => ensure().invoke('driver:getTitle'),
    click: (selector: string) => ensure().invoke('driver:click', { selector }),
    type: (selector: string, text: string, clearFirst?: boolean) => ensure().invoke('driver:type', { selector, text, clearFirst }),
    clear: (selector: string) => ensure().invoke('driver:clear', { selector }),
    exec: (script: string, args?: any[]) => ensure().invoke('driver:exec', { script, args }),
    screenshot: () => ensure().invoke('driver:screenshot'),
    waitForSelector: (selector: string, timeout?: number) => ensure().invoke('driver:waitForSelector', { selector, timeout }),
  },
};