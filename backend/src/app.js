const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');

// Import des routes
const authRoutes = require('./routes/auth.routes');
const employeeRoutes = require('./routes/employee.routes');
const absenceRoutes = require('./routes/absence.routes');
const documentRoutes = require('./routes/document.routes');

// Connexion à la base de données MongoDB
connectDB();

const app = express();

// ─────────────────────────────────────────────
// Middlewares globaux
// ─────────────────────────────────────────────

// Configuration CORS : accepte les requêtes depuis Next.js
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Parser JSON et URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers uploadés statiquement
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ─────────────────────────────────────────────
// Routes API
// ─────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/absences', absenceRoutes);
app.use('/api/documents', documentRoutes);

// Route de santé (health check)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Orvexa API opérationnelle',
    data: { timestamp: new Date().toISOString() },
  });
});

// ─────────────────────────────────────────────
// Gestion des routes inexistantes (404)
// ─────────────────────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `La route ${req.originalUrl} n'existe pas sur ce serveur.`,
  });
});

// ─────────────────────────────────────────────
// Gestionnaire d'erreurs global
// ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Erreur non gérée :', err.stack);

  // Erreur multer : fichier trop volumineux
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'Le fichier est trop volumineux. Taille maximale : 10 MB.',
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur interne du serveur.',
  });
});

// ─────────────────────────────────────────────
// Démarrage du serveur
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur Orvexa démarré sur le port ${PORT}`);
  console.log(`📍 Environnement : ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
