export function pdfBase64ToUrl(base64: string) {
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const blob = new Blob([bytes], { type: "application/pdf" });
  return URL.createObjectURL(blob);
}

export function triggerDownload(url: string, filename: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

// Opened synchronously in the click handler (before any await) so browsers don't
// treat it as a blocked popup; we then fill it with a loading state and later
// navigate it to the finished PDF once the async work resolves.
export function openLoadingTab(message: string) {
  const win = window.open("", "_blank");
  if (!win) return null;
  win.document.write(`<!doctype html>
<html>
<head>
<title>${message}</title>
<style>
  html, body { height: 100%; margin: 0; }
  body {
    display: flex; align-items: center; justify-content: center;
    font-family: system-ui, -apple-system, sans-serif;
    background: #18181b; color: #f4f4f5;
  }
  .wrap { display: flex; flex-direction: column; align-items: center; gap: 14px; }
  .spinner {
    width: 28px; height: 28px; border-radius: 50%;
    border: 3px solid rgba(255,255,255,0.2); border-top-color: #fff;
    animation: spin 0.8s linear infinite;
  }
  p { margin: 0; font-size: 14px; opacity: 0.75; }
  @keyframes spin { to { transform: rotate(360deg); } }
</style>
</head>
<body>
  <div class="wrap">
    <div class="spinner"></div>
    <p>${message}</p>
  </div>
</body>
</html>`);
  win.document.close();
  return win;
}
