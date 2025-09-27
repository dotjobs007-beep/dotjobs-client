"use client";
import { useEffect, useState } from "react";
import { getRedirectResult, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/Firebase/firebase";
import clientLogger from "@/utils/clientLogger";

export default function DebugAuthPage() {
  const [redirectResult, setRedirectResult] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [localKeys, setLocalKeys] = useState<string[]>([]);
  const [idbInfo, setIdbInfo] = useState<any>(null);
  const [logsSent, setLogsSent] = useState(false);

  useEffect(() => {
    async function run() {
      try {
        const res = await getRedirectResult(auth).catch((e) => {
          // some browsers throw here; capture the error
          return { error: String(e) };
        });
        setRedirectResult(res);
      } catch (e) {
        setRedirectResult({ error: String(e) });
      }

      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setCurrentUser(user ?? null);
        if (user) {
          try {
            const t = await user.getIdToken();
            setToken(t);
          } catch (err) {
            setToken(`token-error: ${String(err)}`);
          }
        } else {
          setToken(null);
        }
      });

      // localStorage keys
      try {
        const keys = Object.keys(localStorage || {}).filter((k) => k.toLowerCase().includes("firebase") || k.toLowerCase().includes("auth") || k.toLowerCase().includes("persist"));
        setLocalKeys(keys.slice(0, 50));
      } catch (e) {
        setLocalKeys([`localStorage error: ${String(e)}`]);
      }

      // indexedDB overview (best-effort)
      try {
        // @ts-ignore
        if (indexedDB && indexedDB.databases) {
          // some browsers support indexedDB.databases()
          // @ts-ignore
          const dbs = await indexedDB.databases();
          setIdbInfo(dbs.map((d: any) => ({ name: d.name, version: d.version })));
        } else {
          setIdbInfo("indexedDB.databases() not supported in this browser");
        }
      } catch (e) {
        setIdbInfo(`indexedDB error: ${String(e)}`);
      }

      return () => unsubscribe();
    }

    run();
  }, []);

  const sendToServer = async () => {
    const payload = {
      redirectResult,
      currentUser: currentUser ? { uid: currentUser.uid, email: currentUser.email, providerData: currentUser.providerData } : null,
      token: token ? (token.length > 50 ? token.slice(0, 50) + "..." : token) : null,
      localKeys,
      idbInfo,
      ua: navigator.userAgent,
      href: window.location.href,
    };
    await clientLogger.sendLog("info", "debug-auth snapshot", payload);
    setLogsSent(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Firebase Redirect Debug</h1>

      <section className="mb-4">
        <h2 className="font-semibold">Redirect result</h2>
        <pre className="bg-gray-100 p-2 rounded max-h-40 overflow-auto">{JSON.stringify(redirectResult, null, 2)}</pre>
      </section>

      <section className="mb-4">
        <h2 className="font-semibold">Current user</h2>
        <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(currentUser ? { uid: currentUser.uid, email: currentUser.email, providerData: currentUser.providerData } : null, null, 2)}</pre>
      </section>

      <section className="mb-4">
        <h2 className="font-semibold">ID Token (partial)</h2>
        <pre className="bg-gray-100 p-2 rounded">{token ?? "(no token)"}</pre>
      </section>

      <section className="mb-4">
        <h2 className="font-semibold">localStorage keys (filtered)</h2>
        <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(localKeys, null, 2)}</pre>
      </section>

      <section className="mb-4">
        <h2 className="font-semibold">IndexedDB info</h2>
        <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(idbInfo, null, 2)}</pre>
      </section>

      <div className="flex gap-2">
        <button onClick={sendToServer} className="bg-blue-600 text-white px-4 py-2 rounded">Send snapshot to server logs</button>
        <button onClick={() => location.reload()} className="bg-gray-300 px-4 py-2 rounded">Reload</button>
      </div>

      {logsSent && <p className="mt-2 text-sm text-green-600">Snapshot sent to server logs</p>}
    </div>
  );
}
