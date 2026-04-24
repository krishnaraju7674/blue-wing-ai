import { Client, Account, Databases, ID, Query, Permission, Role } from 'appwrite';

const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';

export const client = new Client();
if (projectId && projectId !== 'your_project_id_here') {
    client.setEndpoint(endpoint).setProject(projectId);
}

export const account = new Account(client);
export const databases = new Databases(client);

export const VAULT_COLLECTION_ID = 'vault';
export const DATABASE_ID = 'blue_wing_main';

// Track whether we have a valid Appwrite session
let _hasSession = null;

async function checkSession() {
    if (_hasSession !== null) return _hasSession;
    try {
        await account.get();
        _hasSession = true;
    } catch {
        _hasSession = false;
    }
    return _hasSession;
}

// Reset session cache (e.g. after login)
export function resetSessionCache() {
    _hasSession = null;
}

export async function commitToVault(message, type = 'system') {
    if (!projectId || projectId === 'your_project_id_here') return null;

    // Don't attempt writes without a valid session
    const hasSession = await checkSession();
    if (!hasSession) return null;

    const hash = Math.random().toString(36).substring(2, 10).toUpperCase();
    try {
        await databases.createDocument(
            DATABASE_ID,
            VAULT_COLLECTION_ID,
            ID.unique(),
            {
                hash: hash,
                message: message,
                type: type,
                timestamp: new Date().toISOString(),
            },
            [
                Permission.read(Role.any()),
                Permission.write(Role.users()),
            ]
        );
        return hash;
    } catch (error) {
        // Silently fail — local hash is still returned for the HUD
        if (error?.code !== 401 && error?.code !== 403) {
            console.warn('Vault write skipped:', error?.message || 'Unknown error');
        }
        return hash;
    }
}

export async function getRecentHashes(limit = 10) {
    if (!projectId || projectId === 'your_project_id_here') return [];

    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            VAULT_COLLECTION_ID,
            [Query.orderDesc('timestamp'), Query.limit(limit)]
        );
        return response.documents;
    } catch (error) {
        return [];
    }
}
