const express = require('express');
const { body } = require('express-validator');
const {
  getAllEmployees,
  getStats,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employee.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

const router = express.Router();

/**
 * Règles de validation pour la création/modification d'un employé
 */
const employeeValidation = [
  body('firstName').notEmpty().withMessage('Le prénom est requis'),
  body('lastName').notEmpty().withMessage('Le nom est requis'),
  body('email').isEmail().withMessage("Format d'email invalide"),
  body('department')
    .isIn(['Tech', 'RH', 'Finance', 'Produit', 'Commercial'])
    .withMessage('Département invalide'),
  body('contractType')
    .isIn(['CDI', 'CDD', 'Stage', 'Alternance'])
    .withMessage('Type de contrat invalide'),
];

// Toutes les routes employés nécessitent une authentification
router.use(protect);

// IMPORTANT : la route /stats doit être déclarée AVANT /:id
router.get('/stats', authorize('RH_ADMIN', 'MANAGER'), getStats);

router.get('/', authorize('RH_ADMIN', 'MANAGER'), getAllEmployees);
router.get('/:id', getEmployeeById);
router.post('/', authorize('RH_ADMIN'), employeeValidation, createEmployee);
router.put('/:id', authorize('RH_ADMIN'), updateEmployee);
router.delete('/:id', authorize('RH_ADMIN'), deleteEmployee);

module.exports = router;
