import { NextResponse } from 'next/server';
import { Client, Databases, ID, Query } from 'node-appwrite';

const DATABASE_ID = 'blue_wing_main';
const MEMORY_COLLECTION = 'memory';

let _db = null;
function getDb() {
  if (_db) return _db;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  if (!projectId) return null;
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
      .setProject(projectId);
    if (process.env.APPWRITE_API_KEY) client.setKey(process.env.APPWRITE_API_KEY);
    _db = new Databases(client);
    return _db;
  } catch (e) {
    return null;
  }
}

// GET — retrieve last N memories
export async function GET(req) {
  const db = getDb();
  if (!db) return NextResponse.json({ memories: [] });
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const response = await db.listDocuments(DATABASE_ID, MEMORY_COLLECTION, [
      Query.orderDesc('$createdAt'),
      Query.limit(limit),
    ]);
    return NextResponse.json({ memories: response.documents.reverse() });
  } catch (err) {
    return NextResponse.json({ memories: [] });
  }
}

// POST — save a memory
export async function POST(req) {
  const db = getDb();
  if (!db) return NextResponse.json({ ok: false });
  try {
    const { role, content, session } = await req.json();
    if (!role || !content) return NextResponse.json({ ok: false });
    await db.createDocument(DATABASE_ID, MEMORY_COLLECTION, ID.unique(), {
      role,
      content: content.substring(0, 4000),
      session: session || 'default',
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false });
  }
}

