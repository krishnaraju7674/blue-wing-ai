const { Client, Databases, ID } = require('node-appwrite');

// Initialization script for Blue Wing Appwrite Vault
// Run this once with your Appwrite API Key to set up the database structure

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

const DATABASE_ID = 'blue_wing_main';
const VAULT_COLLECTION_ID = 'vault';
const MEMORY_COLLECTION_ID = 'memory';

async function init() {
    try {
        console.log('Checking/Creating Database...');
        try {
            await databases.create(DATABASE_ID, 'Blue Wing Main Database');
        } catch (e) {
            console.log('Database already exists or error:', e.message);
        }
        
        console.log('Checking/Creating Vault Collection...');
        try {
            await databases.createCollection(DATABASE_ID, VAULT_COLLECTION_ID, 'Mission Vault');
            console.log('Creating Vault Attributes...');
            await databases.createStringAttribute(DATABASE_ID, VAULT_COLLECTION_ID, 'hash', 8, true);
            await databases.createStringAttribute(DATABASE_ID, VAULT_COLLECTION_ID, 'message', 5000, true);
            await databases.createStringAttribute(DATABASE_ID, VAULT_COLLECTION_ID, 'type', 20, true);
            await databases.createDatetimeAttribute(DATABASE_ID, VAULT_COLLECTION_ID, 'timestamp', true);
        } catch (e) {
            console.log('Vault collection already exists or error:', e.message);
        }

        console.log('Checking/Creating Memory Collection...');
        try {
            await databases.createCollection(DATABASE_ID, MEMORY_COLLECTION_ID, 'Conversation Memory');
            console.log('Creating Memory Attributes...');
            await databases.createStringAttribute(DATABASE_ID, MEMORY_COLLECTION_ID, 'role', 10, true);
            await databases.createStringAttribute(DATABASE_ID, MEMORY_COLLECTION_ID, 'content', 5000, true);
            await databases.createStringAttribute(DATABASE_ID, MEMORY_COLLECTION_ID, 'session', 20, true);
            await databases.createDatetimeAttribute(DATABASE_ID, MEMORY_COLLECTION_ID, 'timestamp', true);
        } catch (e) {
            console.log('Memory collection already exists or error:', e.message);
        }

        console.log('Wait for attributes to propagate...');
        await new Promise(r => setTimeout(r, 5000));

        console.log('Creating Indexes...');
        try {
            await databases.createIndex(DATABASE_ID, VAULT_COLLECTION_ID, 'idx_timestamp', 'key', ['timestamp'], ['DESC']);
        } catch (e) {}
        try {
            await databases.createIndex(DATABASE_ID, MEMORY_COLLECTION_ID, 'idx_mem_timestamp', 'key', ['timestamp'], ['DESC']);
        } catch (e) {}

        console.log('✅ Blue Wing Infrastructure initialized successfully.');
    } catch (error) {
        console.error('❌ Setup failed:', error.message);
    }
}

init();
