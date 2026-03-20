const express = require('express');
const { body } = require('express-validator');
const {
  getAllAbsences,
  getMyAbsences,
  getAbsenceById,
  createAbsence,
  approveAbsence,
  rejectAbsence,
  deleteAbsence,
} = require('../controllers/absence.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

const router = express.Router();

/**
 * Règles de validation pour la création d'une absence
 */
const absenceValidation = [
  body('employeeId').notEmpty().withMessage("L'identifiant de l'employé est requis"),
  body('type')
    .isIn(['Congés payés', 'RTT', 'Maladie', 'Sans solde'])
    .withMessage("Type d'absence invalide"),
  body('startDate').isISO8601().withMessage('Date de début invalide'),
  body('endDate').isISO8601().withMessage('Date de fin invalide'),
];

// Toutes les routes absences nécessitent une authentification
router.use(protect);

// IMPORTANT : les routes spécifiques (/mine) doivent être avant /:id
router.get('/mine', getMyAbsences);

router.get('/', authorize('RH_ADMIN', 'MANAGER'), getAllAbsences);
router.get('/:id', getAbsenceById);
router.post('/', absenceValidation, createAbsence);
router.put('/:id/approve', authorize('RH_ADMIN', 'MANAGER'), approveAbsence);
router.put('/:id/reject', authorize('RH_ADMIN', 'MANAGER'), rejectAbsence);
router.delete('/:id', deleteAbsence);

module.exports = router;
