const { validationResult } = require('express-validator');
const Absence = require('../models/Absence');

/**
 * GET /api/absences
 * Récupérer toutes les absences (admin/manager)
 */
const getAllAbsences = async (req, res) => {
  try {
    const { status, type, employeeId } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (type) filter.type = type;
    if (employeeId) filter.employeeId = employeeId;

    const absences = await Absence.find(filter)
      .populate('employeeId', 'firstName lastName email department')
      .populate('approvedBy', 'email role')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Liste des absences récupérée avec succès.',
      data: { total: absences.length, absences },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des absences.',
      data: error.message,
    });
  }
};

/**
 * GET /api/absences/mine
 * Récupérer les absences de l'employé connecté
 */
const getMyAbsences = async (req, res) => {
  try {
    // L'utilisateur connecté doit avoir un employeeId associé
    if (!req.user.employeeId) {
      return res.status(400).json({
        success: false,
        message: "Aucun profil employé associé à ce compte.",
      });
    }

    const absences = await Absence.find({ employeeId: req.user.employeeId })
      .populate('approvedBy', 'email role')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Mes absences récupérées avec succès.',
      data: { total: absences.length, absences },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération de vos absences.',
      data: error.message,
    });
  }
};

/**
 * GET /api/absences/:id
 * Récupérer le détail d'une absence
 */
const getAbsenceById = async (req, res) => {
  try {
    const absence = await Absence.findById(req.params.id)
      .populate('employeeId', 'firstName lastName email department')
      .populate('approvedBy', 'email role');

    if (!absence) {
      return res.status(404).json({
        success: false,
        message: 'Absence introuvable.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Absence récupérée avec succès.',
      data: absence,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération de l'absence.",
      data: error.message,
    });
  }
};

/**
 * POST /api/absences
 * Créer une demande d'absence
 */
const createAbsence = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        data: errors.array(),
      });
    }

    const { startDate, endDate } = req.body;

    // Vérifier que la date de fin est après la date de début
    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({
        success: false,
        message: 'La date de fin doit être postérieure à la date de début.',
      });
    }

    const absence = await Absence.create(req.body);
    await absence.populate('employeeId', 'firstName lastName email');

    return res.status(201).json({
      success: true,
      message: "Demande d'absence créée avec succès.",
      data: absence,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la création de la demande d'absence.",
      data: error.message,
    });
  }
};

/**
 * PUT /api/absences/:id/approve
 * Approuver une demande d'absence (admin/manager)
 */
const approveAbsence = async (req, res) => {
  try {
    const absence = await Absence.findById(req.params.id);

    if (!absence) {
      return res.status(404).json({
        success: false,
        message: 'Absence introuvable.',
      });
    }

    if (absence.status !== 'En attente') {
      return res.status(400).json({
        success: false,
        message: `Cette absence est déjà "${absence.status}".`,
      });
    }

    absence.status = 'Approuvé';
    absence.approvedBy = req.user._id;
    await absence.save();

    await absence.populate('employeeId', 'firstName lastName email');
    await absence.populate('approvedBy', 'email role');

    return res.status(200).json({
      success: true,
      message: "Demande d'absence approuvée.",
      data: absence,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de l'approbation de l'absence.",
      data: error.message,
    });
  }
};

/**
 * PUT /api/absences/:id/reject
 * Refuser une demande d'absence (admin/manager)
 */
const rejectAbsence = async (req, res) => {
  try {
    const absence = await Absence.findById(req.params.id);

    if (!absence) {
      return res.status(404).json({
        success: false,
        message: 'Absence introuvable.',
      });
    }

    if (absence.status !== 'En attente') {
      return res.status(400).json({
        success: false,
        message: `Cette absence est déjà "${absence.status}".`,
      });
    }

    absence.status = 'Refusé';
    absence.approvedBy = req.user._id;
    await absence.save();

    await absence.populate('employeeId', 'firstName lastName email');
    await absence.populate('approvedBy', 'email role');

    return res.status(200).json({
      success: true,
      message: "Demande d'absence refusée.",
      data: absence,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors du refus de l'absence.",
      data: error.message,
    });
  }
};

/**
 * DELETE /api/absences/:id
 * Supprimer une demande d'absence
 */
const deleteAbsence = async (req, res) => {
  try {
    const absence = await Absence.findById(req.params.id);

    if (!absence) {
      return res.status(404).json({
        success: false,
        message: 'Absence introuvable.',
      });
    }

    // Un employé ne peut supprimer que ses propres demandes en attente
    if (
      req.user.role === 'EMPLOYEE' &&
      absence.employeeId.toString() !== req.user.employeeId?.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Vous n'êtes pas autorisé à supprimer cette demande.",
      });
    }

    await absence.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Demande d'absence supprimée avec succès.",
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la suppression de l'absence.",
      data: error.message,
    });
  }
};

module.exports = {
  getAllAbsences,
  getMyAbsences,
  getAbsenceById,
  createAbsence,
  approveAbsence,
  rejectAbsence,
  deleteAbsence,
};
