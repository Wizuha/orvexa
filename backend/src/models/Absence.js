const mongoose = require('mongoose');

/**
 * Modèle Absence - Gestion des demandes d'absence des employés
 */
const absenceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, "L'identifiant de l'employé est obligatoire"],
    },
    type: {
      type: String,
      enum: ['Congés payés', 'RTT', 'Maladie', 'Sans solde'],
      required: [true, "Le type d'absence est obligatoire"],
    },
    startDate: {
      type: Date,
      required: [true, 'La date de début est obligatoire'],
    },
    endDate: {
      type: Date,
      required: [true, 'La date de fin est obligatoire'],
    },
    duration: {
      type: Number, // Durée en jours (calculée automatiquement)
      min: [0, 'La durée ne peut pas être négative'],
    },
    status: {
      type: String,
      enum: ['En attente', 'Approuvé', 'Refusé'],
      default: 'En attente',
    },
    reason: {
      type: String,
      trim: true,
      default: null,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Hook pre-save : calculer automatiquement la durée en jours ouvrés
 */
absenceSchema.pre('save', function (next) {
  if (this.startDate && this.endDate) {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    // Calcul simple en jours calendaires (week-ends inclus)
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    this.duration = diffDays;
  }
  next();
});

module.exports = mongoose.model('Absence', absenceSchema);
