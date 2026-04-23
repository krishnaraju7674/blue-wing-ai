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

async function init() {
    try {
        console.log('Creating Database...');
        await databases.create(DATABASE_ID, 'Blue Wing Main Database');
        
        console.log('Creating Vault Collection...');
        await databases.createCollection(DATABASE_ID, VAULT_COLLECTION_ID, 'Mission Vault');

        console.log('Creating Attributes...');
        await databases.createStringAttribute(DATABASE_ID, VAULT_COLLECTION_ID, 'hash', 8, true);
        await databases.createStringAttribute(DATABASE_ID, VAULT_COLLECTION_ID, 'message', 5000, true);
        await databases.createStringAttribute(DATABASE_ID, VAULT_COLLECTION_ID, 'type', 20, true);
        await databases.createDatetimeAttribute(DATABASE_ID, VAULT_COLLECTION_ID, 'timestamp', true);

        console.log('Wait for attributes to propagate...');
        await new Promise(r => setTimeout(r, 5000));

        console.log('Creating Indexes...');
        await databases.createIndex(DATABASE_ID, VAULT_COLLECTION_ID, 'idx_timestamp', 'key', ['timestamp'], ['DESC']);

        console.log('✅ Blue Wing Vault initialized successfully.');
    } catch (error) {
        console.error('❌ Setup failed:', error.message);
    }
}

init();
