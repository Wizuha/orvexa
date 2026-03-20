const { validationResult } = require('express-validator');
const Document = require('../models/Document');

/**
 * GET /api/documents
 * Récupérer les documents accessibles selon le rôle et la visibilité
 */
const getAllDocuments = async (req, res) => {
  try {
    const { type, employeeId, visibility } = req.query;
    let filter = {};

    if (type) filter.type = type;
    if (employeeId) filter.employeeId = employeeId;

    // Les employés ne voient que les documents publics ou les leurs
    if (req.user.role === 'EMPLOYEE') {
      filter.$or = [
        { visibility: 'Public' },
        { employeeId: req.user.employeeId },
      ];
    } else if (visibility) {
      filter.visibility = visibility;
    }

    const documents = await Document.find(filter)
      .populate('employeeId', 'firstName lastName email')
      .populate('uploadedBy', 'email role')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Liste des documents récupérée avec succès.',
      data: { total: documents.length, documents },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des documents.',
      data: error.message,
    });
  }
};

/**
 * GET /api/documents/:id
 * Récupérer le détail d'un document
 */
const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('employeeId', 'firstName lastName email')
      .populate('uploadedBy', 'email role');

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document introuvable.',
      });
    }

    // Vérifier l'accès pour les employés
    if (req.user.role === 'EMPLOYEE') {
      const isOwner =
        document.employeeId?._id.toString() === req.user.employeeId?.toString();
      if (!isOwner && document.visibility !== 'Public') {
        return res.status(403).json({
          success: false,
          message: "Vous n'êtes pas autorisé à accéder à ce document.",
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Document récupéré avec succès.',
      data: document,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération du document.',
      data: error.message,
    });
  }
};

/**
 * POST /api/documents
 * Uploader un nouveau document (admin uniquement)
 * Multer gère l'upload du fichier en amont (middleware)
 */
const createDocument = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        data: errors.array(),
      });
    }

    let fileUrl = req.body.fileUrl;
    let fileSize = req.body.fileSize || null;

    // Si un fichier a été uploadé via multer
    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
      fileSize = req.file.size;
    }

    if (!fileUrl) {
      return res.status(400).json({
        success: false,
        message: "L'URL ou le fichier est requis.",
      });
    }

    const document = await Document.create({
      ...req.body,
      fileUrl,
      fileSize,
      uploadedBy: req.user._id,
    });

    await document.populate('uploadedBy', 'email role');

    return res.status(201).json({
      success: true,
      message: 'Document créé avec succès.',
      data: document,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création du document.',
      data: error.message,
    });
  }
};

/**
 * DELETE /api/documents/:id
 * Supprimer un document (admin uniquement)
 */
const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findByIdAndDelete(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document introuvable.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Document supprimé avec succès.',
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression du document.',
      data: error.message,
    });
  }
};

module.exports = {
  getAllDocuments,
  getDocumentById,
  createDocument,
  deleteDocument,
};
