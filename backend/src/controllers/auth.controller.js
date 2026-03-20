const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

/**
 * Générer un token JWT pour un utilisateur
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

/**
 * POST /api/auth/register
 * Créer un nouveau compte utilisateur
 */
const register = async (req, res) => {
  try {
    // Validation des données entrantes
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        data: errors.array(),
      });
    }

    const { email, password, role } = req.body;

    // Vérifier si l'email est déjà utilisé
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Un compte avec cet email existe déjà.',
      });
    }

    // Créer l'utilisateur (le mot de passe sera hashé via le hook pre-save)
    const user = await User.create({ email, password, role });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Compte créé avec succès.',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création du compte.',
      data: error.message,
    });
  }
};

/**
 * POST /api/auth/login
 * Connexion d'un utilisateur, retourne un token JWT
 */
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        data: errors.array(),
      });
    }

    const { email, password } = req.body;

    // Récupérer l'utilisateur avec le mot de passe (select: false par défaut)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect.',
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect.',
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Connexion réussie.',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          employeeId: user.employeeId,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la connexion.',
      data: error.message,
    });
  }
};

/**
 * GET /api/auth/me
 * Retourner le profil de l'utilisateur connecté
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('employeeId');

    return res.status(200).json({
      success: true,
      message: 'Profil récupéré avec succès.',
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération du profil.',
      data: error.message,
    });
  }
};

/**
 * PUT /api/auth/me
 * Modifier le profil de l'utilisateur connecté
 */
const updateMe = async (req, res) => {
  try {
    // Ne pas autoriser la modification du mot de passe via cette route
    const { password, role, ...updateData } = req.body;

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: 'Profil mis à jour avec succès.',
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour du profil.',
      data: error.message,
    });
  }
};

/**
 * PUT /api/auth/password
 * Changer le mot de passe de l'utilisateur connecté
 */
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Le mot de passe actuel et le nouveau mot de passe sont requis.',
      });
    }

    // Récupérer l'utilisateur avec le mot de passe
    const user = await User.findById(req.user._id).select('+password');

    // Vérifier le mot de passe actuel
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Le mot de passe actuel est incorrect.',
      });
    }

    // Mettre à jour le mot de passe (sera hashé via le hook pre-save)
    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Mot de passe mis à jour avec succès.',
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors du changement de mot de passe.',
      data: error.message,
    });
  }
};

module.exports = { register, login, getMe, updateMe, updatePassword };
