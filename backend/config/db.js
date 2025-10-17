import mongoose from 'mongoose';

export default async function connectDB() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI/MONGO_URI manquant dans .env');
    process.exit(1);
  }
  try {
    await mongoose.connect(uri, {
      dbName: process.env.DB_NAME || undefined,
    });
    console.log('✅ MongoDB connecté');
  } catch (err) {
    console.error('❌ Erreur de connexion MongoDB:', err?.message || err);
    process.exit(1);
  }
}

