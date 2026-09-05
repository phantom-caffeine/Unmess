import { MongoClient } from 'mongodb';
import { required, templates } from './config.js';

const databaseName = process.env.MONGODB_DB_NAME || 'unmess';
const collectionName = process.env.MONGODB_COLLECTION_NAME || 'store';
let clientPromise;

function getClient() {
  if (!clientPromise) {
    const client = new MongoClient(required('MONGODB_URI'), { maxPoolSize: 10, minPoolSize: 0, serverSelectionTimeoutMS: 8000 });
    clientPromise = client.connect();
  }
  return clientPromise;
}

async function getStore() {
  const client = await getClient();
  return client.db(databaseName).collection(collectionName);
}

export async function incrementTemplateClicks(templateId) {
  if (!templates[templateId]) return null;
  const store = await getStore();
  return store.findOneAndUpdate(
    { _id: `template:${templateId}`, type: 'template' },
    { $inc: { clicks: 1 }, $set: { updatedAt: new Date() } },
    { returnDocument: 'after' },
  );
}

export async function getTemplate(templateId) {
  if (!templates[templateId]) return null;
  const store = await getStore();
  return store.findOne({ _id: `template:${templateId}`, type: 'template' });
}

export async function getAllClickCounts() {
  const store = await getStore();
  const docs = await store.find({ type: 'template' }, { projection: { name: 1, clicks: 1, updatedAt: 1 } }).toArray();
  return docs.map(doc => ({ templateId: doc._id.replace('template:', ''), name: doc.name, clicks: doc.clicks ?? 0, updatedAt: doc.updatedAt ?? null }));
}

export async function initializeStore() {
  const store = await getStore();
  const now = new Date();
  await Promise.all(Object.entries(templates).map(([templateId, template]) => store.updateOne(
    { _id: `template:${templateId}` },
    {
      $set: { type: 'template', templateId, name: template.name, url: template.url, updatedAt: now },
      $unset: { price: '', currency: '' },
      $setOnInsert: { clicks: 0, createdAt: now },
    },
    { upsert: true },
  )));
  await store.deleteOne({ _id: 'payment' });
  return { templates: await getAllClickCounts() };
}
