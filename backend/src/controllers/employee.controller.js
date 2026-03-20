const { validationResult } = require('express-validator');
const Employee = require('../models/Employee');

/**
 * GET /api/employees
 * Récupérer la liste de tous les employés (admin/manager)
 */
const getAllEmployees = async (req, res) => {
  try {
    // Filtres optionnels via query params
    const { department, status, contractType, search } = req.query;
    const filter = {};

    if (department) filter.department = department;
    if (status) filter.status = status;
    if (contractType) filter.contractType = contractType;
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const employees = await Employee.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Liste des employés récupérée avec succès.',
      data: { total: employees.length, employees },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des employés.',
      data: error.message,
    });
  }
};

/**
 * GET /api/employees/stats
 * Récupérer les statistiques du tableau de bord
 */
const getStats = async (req, res) => {
  try {
    // Total des employés
    const total = await Employee.countDocuments();

    // Répartition par département
    const byDepartment = await Employee.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Répartition par statut
    const byStatus = await Employee.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Répartition par type de contrat
    const byContractType = await Employee.aggregate([
      { $group: { _id: '$contractType', count: { $sum: 1 } } },
    ]);

    return res.status(200).json({
      success: true,
      message: 'Statistiques récupérées avec succès.',
      data: { total, byDepartment, byStatus, byContractType },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des statistiques.',
      data: error.message,
    });
  }
};

/**
 * GET /api/employees/:id
 * Récupérer le détail d'un employé
 */
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employé introuvable.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Employé récupéré avec succès.',
      data: employee,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la récupération de l'employé.",
      data: error.message,
    });
  }
};

/**
 * POST /api/employees
 * Créer un nouvel employé (admin uniquement)
 */
const createEmployee = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        data: errors.array(),
      });
    }

    const employee = await Employee.create(req.body);

    return res.status(201).json({
      success: true,
      message: 'Employé créé avec succès.',
      data: employee,
    });
  } catch (error) {
    // Gérer l'erreur de doublon sur l'email
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Un employé avec cet email existe déjà.',
      });
    }
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la création de l'employé.",
      data: error.message,
    });
  }
};

/**
 * PUT /api/employees/:id
 * Modifier un employé existant (admin uniquement)
 */
const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employé introuvable.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Employé mis à jour avec succès.',
      data: employee,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la mise à jour de l'employé.",
      data: error.message,
    });
  }
};

/**
 * DELETE /api/employees/:id
 * Supprimer un employé (admin uniquement)
 */
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employé introuvable.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Employé supprimé avec succès.',
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la suppression de l'employé.",
      data: error.message,
    });
  }
};

module.exports = {
  getAllEmployees,
  getStats,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
