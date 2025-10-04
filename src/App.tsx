import { useEffect, useState } from 'react';
import { mini } from './miniappSdk';

export default function App() {
  const [status, setStatus] = useState<any>(null);
  const [error, setError] = useState<string>('');

  // connection settings
  const [mode, setMode] = useState<'launch' | 'attach'>('launch');
  const [executablePath, setExecutablePath] = useState<string>('/opt/google/chrome/google-chrome');
  const [userDataDir, setUserDataDir] = useState<string>('/home/lap16495/.config/google-chrome/Default');

  // driver fields
  const [url, setUrl] = useState<string>('https://example.com');
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [selector, setSelector] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [clearFirst, setClearFirst] = useState<boolean>(true);
  const [script, setScript] = useState<string>('return document.title');
  const [argsJson, setArgsJson] = useState<string>('[]');
  const [waitSelector, setWaitSelector] = useState<string>('body');
  const [waitTimeout, setWaitTimeout] = useState<number>(5000);

  useEffect(() => {
    (async () => {
      try {
        const st = await mini.getStatus();
        setStatus(st);
      } catch (e: any) {
        setError(String(e?.message || e));
      }
    })();
  }, []);

  const connect = async () => {
    setError('');
    const res = await mini.connectChrome({ mode, executablePath, userDataDir });
    if (!res.ok) setError(res.error || 'connect failed');
  };

  const closeBrowser = async () => {
    setError('');
    const res = await mini.closeBrowser();
    if (!res.ok) setError(res.error || 'close failed');
  };

  const navigate = async () => {
    setError('');
    const r = await mini.driver.navigate(url);
    if (!r.ok) setError(r.error || 'navigate failed');
  };

  const getUrl = async () => {
    setError('');
    const r = await mini.driver.getUrl();
    if (r.ok) setCurrentUrl(String(r.data || ''));
    else setError(r.error || 'getUrl failed');
  };

  const getTitle = async () => {
    setError('');
    const r = await mini.driver.getTitle();
    if (r.ok) setTitle(String(r.data || ''));
    else setError(r.error || 'getTitle failed');
  };

  const click = async () => {
    setError('');
    if (!selector) { setError('selector is required'); return; }
    const r = await mini.driver.click(selector);
    if (!r.ok) setError(r.error || 'click failed');
  };

  const type = async () => {
    setError('');
    if (!selector) { setError('selector is required'); return; }
    const r = await mini.driver.type(selector, text, clearFirst);
    if (!r.ok) setError(r.error || 'type failed');
  };

  const clear = async () => {
    setError('');
    if (!selector) { setError('selector is required'); return; }
    const r = await mini.driver.clear(selector);
    if (!r.ok) setError(r.error || 'clear failed');
  };

  const exec = async () => {
    setError('');
    let args: any[] | undefined = undefined;
    try {
      args = JSON.parse(argsJson || '[]');
    } catch (e) {
      setError('Args must be valid JSON array');
      return;
    }
    const r = await mini.driver.exec(script, args);
    if (!r.ok) setError(r.error || 'exec failed');
    else setTitle(JSON.stringify(r.data));
  };

  const waitFor = async () => {
    setError('');
    if (!waitSelector) { setError('wait selector is required'); return; }
    const r = await mini.driver.waitForSelector(waitSelector, waitTimeout);
    if (!r.ok) setError(r.error || 'waitForSelector failed');
  };

  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h1>MiniApp SDK Demo</h1>

      <section style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
        <h3>Bridge Status</h3>
        <pre style={{ maxHeight: 160, overflow: 'auto', background: '#f7f7f7', padding: 8 }}>{JSON.stringify(status, null, 2)}</pre>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </section>

      <section style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
        <h3>Chrome Connection</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label>
            Mode:
            <select value={mode} onChange={e => setMode(e.target.value as any)} style={{ marginLeft: 8 }}>
              <option value="launch">launch</option>
              <option value="attach">attach</option>
            </select>
          </label>
          <label>
            Executable Path:
            <input value={executablePath} onChange={e => setExecutablePath(e.target.value)} style={{ width: '100%' }} />
          </label>
          <label>
            User Data Dir:
            <input value={userDataDir} onChange={e => setUserDataDir(e.target.value)} style={{ width: '100%' }} />
          </label>
          <div>
            <button onClick={connect}>Connect Chrome</button>
            <button onClick={closeBrowser} style={{ marginLeft: 8 }}>Close Browser</button>
          </div>
        </div>
      </section>

      <section style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
        <h3>Navigation</h3>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input value={url} onChange={e => setUrl(e.target.value)} style={{ flex: 1 }} />
          <button onClick={navigate}>Go</button>
          <button onClick={getUrl}>Get URL</button>
          <button onClick={getTitle}>Get Title</button>
        </div>
        {currentUrl && <div>Current URL: {currentUrl}</div>}
        {title && <div>Title: {title}</div>}
      </section>

      <section style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
        <h3>Element Actions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label>
            Selector:
            <input value={selector} onChange={e => setSelector(e.target.value)} style={{ width: '100%', marginLeft: 8 }} />
          </label>
          <div>
            <button onClick={click}>Click</button>
            <button onClick={clear} style={{ marginLeft: 8 }}>Clear</button>
          </div>
          <label>
            Text:
            <input value={text} onChange={e => setText(e.target.value)} style={{ width: '100%', marginLeft: 8 }} />
          </label>
          <label>
            <input type="checkbox" checked={clearFirst} onChange={e => setClearFirst(e.target.checked)} /> Clear first
          </label>
          <button onClick={type}>Type</button>
        </div>
      </section>

      <section style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
        <h3>Eval / Wait</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label>
            Script:
            <input value={script} onChange={e => setScript(e.target.value)} style={{ width: '100%' }} />
          </label>
          <label>
            Args (JSON array):
            <input value={argsJson} onChange={e => setArgsJson(e.target.value)} style={{ width: '100%' }} />
          </label>
          <button onClick={exec}>Execute</button>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input placeholder="selector to wait" value={waitSelector} onChange={e => setWaitSelector(e.target.value)} style={{ flex: 1 }} />
            <input type="number" value={waitTimeout} onChange={e => setWaitTimeout(Number(e.target.value))} style={{ width: 120 }} />
            <button onClick={waitFor}>Wait For Selector</button>
          </div>
        </div>
      </section>
    </div>
  );
}