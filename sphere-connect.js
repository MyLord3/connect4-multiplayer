// sphere-connect.js
// ── Imports from the UMD bundle exposed as window.SphereSDK ───────────────
const { ConnectClient, HOST_READY_TYPE, HOST_READY_TIMEOUT, PERMISSION_SCOPES } =
  window.SphereSDK.connect;
const { PostMessageTransport, ExtensionTransport } =
  window.SphereSDK.connect.browser;

const WALLET_URL = 'https://sphere.unicity.network';
const SESSION_KEY = 'connect4-sphere-session';

let client = null;
let transport = null;
let popupWindow = null;

// ── Mode detection (this is what was completely missing) ──────────────────
function isInIframe() {
  try {
    return window.parent !== window && window.self !== window.top;
  } catch {
    return true;
  }
}

function hasExtension() {
  try {
    const sphere = window.sphere;
    if (!sphere || typeof sphere !== 'object') return false;
    return typeof sphere.isInstalled === 'function' && sphere.isInstalled() === true;
  } catch {
    return false;
  }
}

function waitForHostReady() {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      window.removeEventListener('message', handler);
      reject(new Error('Wallet did not respond in time'));
    }, HOST_READY_TIMEOUT);

    function handler(event) {
      if (event.data?.type === HOST_READY_TYPE) {
        clearTimeout(timeout);
        window.removeEventListener('message', handler);
        resolve();
      }
    }
    window.addEventListener('message', handler);
  });
}

// ── Connect ────────────────────────────────────────────────────────────────
async function connectWallet() {
  const btn = document.getElementById('connectBtn');
  btn.textContent = 'Connecting...';
  btn.disabled = true;

  try {
    let resumeSessionId;

    // Pick transport based on how the game was opened
    if (isInIframe()) {
      // Opened inside Sphere's iframe
      transport = PostMessageTransport.forClient();
    } else if (hasExtension()) {
      // Sphere browser extension is installed
      transport = ExtensionTransport.forClient();
    } else {
      // Standalone — open wallet in a popup
      if (!popupWindow || popupWindow.closed) {
        popupWindow = window.open(
          WALLET_URL + '/connect?origin=' + encodeURIComponent(location.origin),
          'sphere-wallet',
          'width=420,height=650'
        );
        if (!popupWindow) throw new Error('Popup blocked. Please allow popups for this site.');
      }
      transport?.destroy();
      transport = PostMessageTransport.forClient({
        target: popupWindow,
        targetOrigin: WALLET_URL,
      });
      await waitForHostReady();
      resumeSessionId = sessionStorage.getItem(SESSION_KEY) ?? undefined;
    }

    client = new ConnectClient({
      transport,
      dapp: { name: 'Connect 4', description: 'Multiplayer Connect 4 on Unicity', url: location.origin },
      permissions: [PERMISSION_SCOPES.IDENTITY_READ, PERMISSION_SCOPES.BALANCE_READ],
      resumeSessionId,
    });

    const result = await client.connect();

    if (result.sessionId) sessionStorage.setItem(SESSION_KEY, result.sessionId);

    const nametag = result.identity?.nametag || 'Connected';
    document.getElementById('playerName').textContent = 'Connected: ' + nametag;
    btn.textContent = 'Connected ✓';
    btn.disabled = false;

    // Expose identity for multiplayer.js / game.js
    window.SphereWallet = { identity: result.identity, client };

  } catch (e) {
    console.error(e);
    btn.textContent = 'Connect Wallet';
    btn.disabled = false;
    document.getElementById('playerName').textContent = 'Connection failed: ' + e.message;
  }
}

// ── Auto-reconnect ─────────────────────────────────────────────────────────
window.addEventListener('load', () => {
  document.getElementById('connectBtn').addEventListener('click', connectWallet);

  const hasSession = isInIframe() || hasExtension() || sessionStorage.getItem(SESSION_KEY);
  if (hasSession) connectWallet();

  // Poll for popup close
  setInterval(() => {
    if (popupWindow && popupWindow.closed) {
      popupWindow = null;
      document.getElementById('playerName').textContent = 'Not connected';
      document.getElementById('connectBtn').textContent = 'Connect Wallet';
    }
  }, 1000);
});
