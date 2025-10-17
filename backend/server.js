import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import utilisateurRoutes from './routes/utilisateurRoutes.js';
import historiqueRoutes from './routes/historiqueRoutes.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes principales
app.use('/api/utilisateurs', utilisateurRoutes);
app.use('/api/historiques', historiqueRoutes);

// Healthcheck & root
app.get('/', (req, res) => {
  res.send('YangoP API running');
});
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Serveur YangoP lancé sur le port ${PORT}`));

