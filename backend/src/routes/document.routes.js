const express = require('express');
const multer = require('multer');
const path = require('path');
const { body } = require('express-validator');
const {
  getAllDocuments,
  getDocumentById,
  createDocument,
  deleteDocument,
} = require('../controllers/document.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

const router = express.Router();

/**
 * Configuration de multer pour l'upload de fichiers
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Dossier de destination (à créer)
  },
  filename: (req, file, cb) => {
    // Nom unique : timestamp + nom original
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// Filtre : accepter uniquement PDF, images et documents Word
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorisé. Formats acceptés : PDF, JPG, PNG, DOC, DOCX'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limite à 10 MB
});

/**
 * Règles de validation pour la création d'un document
 */
const documentValidation = [
  body('name').notEmpty().withMessage('Le nom du document est requis'),
  body('type')
    .isIn(['Contrat', 'Paie', 'Note interne', 'Finance', 'Avenant'])
    .withMessage('Type de document invalide'),
];

// Toutes les routes documents nécessitent une authentification
router.use(protect);

router.get('/', getAllDocuments);
router.get('/:id', getDocumentById);
router.post(
  '/',
  authorize('RH_ADMIN'),
  upload.single('file'),
  documentValidation,
  createDocument
);
router.delete('/:id', authorize('RH_ADMIN'), deleteDocument);

module.exports = router;
