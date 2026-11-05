import { createClient } from "@base44/sdk";
import { appParams } from "@/lib/app-params";
import { localDb } from "@/lib/localCyberService";

export const isBase44Configured = Boolean(appParams.appId && appParams.appBaseUrl);

const remoteDb = createClient({
  appId: appParams.appId || "",
  token: appParams.token || undefined,
  functionsVersion: appParams.functionsVersion || undefined,
});

// The local adapter intentionally mirrors the dynamic SDK surface used by this app.
/** @type {any} */
export const db = isBase44Configured ? remoteDb : localDb;
export const base44 = db;
export default db;
