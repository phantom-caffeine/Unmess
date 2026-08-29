import { MongoClient } from 'mongodb';
import { required, templates } from './config.js';

let clientPromise;
function getClient() {
  if (!clientPromise) {
    const client = new MongoClient(required('MONGODB_URI'), {
      maxPoolSize: 10,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 8000,
    });
    clientPromise = client.connect();
  }
  return clientPromise;
}

export async function incrementTemplateClicks(templateId) {
  const databaseName = templates[templateId];
  if (!databaseName) return null;
  const client = await getClient();
  const result = await client
    .db(databaseName)
    .collection('analytics')
    .findOneAndUpdate(
      { _id: 'clicks' },
      {
        $inc: { count: 1 },
        $set: { updatedAt: new Date() },
        $setOnInsert: { templateId, createdAt: new Date() },
      },
      { upsert: true, returnDocument: 'after' },
    );
  return result;
}

export async function getAllClickCounts() {
  const client = await getClient();
  return Promise.all(
    Object.entries(templates).map(async ([templateId, databaseName]) => {
      const doc = await client.db(databaseName).collection('analytics').findOne({ _id: 'clicks' });
      return { templateId, clicks: doc?.count ?? 0, updatedAt: doc?.updatedAt ?? null };
    }),
  );
}
