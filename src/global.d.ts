export {};

declare global {
  interface Window {
    MiniApp: {
      ready: () => Promise<boolean>;
      getStatus: () => Promise<any>;
      connectChrome: (settings: any) => Promise<{ ok: boolean; error?: string }>;
      closeBrowser: () => Promise<{ ok: boolean; error?: string }>;
      driver: {
        navigate: (url: string) => Promise<any>;
        getUrl: () => Promise<{ ok: boolean; data?: string; error?: string }>;
        getTitle: () => Promise<{ ok: boolean; data?: string; error?: string }>;
        click: (selector: string) => Promise<any>;
        type: (selector: string, text: string, opts?: { clearFirst?: boolean }) => Promise<any>;
        clear: (selector: string) => Promise<any>;
        exec: (script: string, args?: any[]) => Promise<{ ok: boolean; data?: any; error?: string }>;
        screenshot: () => Promise<{ ok: boolean; data?: string; error?: string }>;
        waitForSelector: (selector: string, timeout?: number) => Promise<any>;
      };
      on: (event: string, cb: (data: any) => void) => () => void;
      off: (event: string, cb: (data: any) => void) => void;
      invoke: (method: string, params?: any) => Promise<{ ok: boolean; data?: any; error?: string }>;
      request: (method: string, params?: any) => Promise<{ ok: boolean; data?: any; error?: string }>;
    };
  }
}