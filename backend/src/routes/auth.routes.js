const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  getMe,
  updateMe,
  updatePassword,
} = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * Règles de validation pour l'inscription
 */
const registerValidation = [
  body('email').isEmail().withMessage("Format d'email invalide"),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('role')
    .optional()
    .isIn(['RH_ADMIN', 'MANAGER', 'EMPLOYEE'])
    .withMessage('Rôle invalide'),
];

/**
 * Règles de validation pour la connexion
 */
const loginValidation = [
  body('email').isEmail().withMessage("Format d'email invalide"),
  body('password').notEmpty().withMessage('Le mot de passe est requis'),
];

// Routes publiques
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Routes protégées
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.put('/password', protect, updatePassword);

module.exports = router;
