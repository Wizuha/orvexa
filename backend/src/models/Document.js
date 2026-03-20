const mongoose = require('mongoose');

/**
 * Modèle Document - Gestion des documents RH (contrats, bulletins de paie, etc.)
 */
const documentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom du document est obligatoire'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['Contrat', 'Paie', 'Note interne', 'Finance', 'Avenant'],
      required: [true, 'Le type de document est obligatoire'],
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      default: null, // Peut être null pour les documents généraux
    },
    visibility: {
      type: String,
      enum: ['Privé', 'Public'],
      default: 'Privé',
    },
    fileUrl: {
      type: String,
      required: [true, "L'URL du fichier est obligatoire"],
    },
    fileSize: {
      type: Number, // Taille en octets
      default: null,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, "L'identifiant de l'uploader est obligatoire"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Document', documentSchema);
