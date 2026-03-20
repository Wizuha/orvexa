const mongoose = require('mongoose');

/**
 * Modèle Employee - Informations des employés de l'entreprise
 */
const employeeSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Le prénom est obligatoire'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Le nom est obligatoire'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "L'email professionnel est obligatoire"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Format d'email invalide"],
    },
    phone: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      enum: ['Tech', 'RH', 'Finance', 'Produit', 'Commercial'],
      required: [true, 'Le département est obligatoire'],
    },
    position: {
      type: String,
      trim: true,
    },
    contractType: {
      type: String,
      enum: ['CDI', 'CDD', 'Stage', 'Alternance'],
      required: [true, 'Le type de contrat est obligatoire'],
    },
    startDate: {
      type: Date,
    },
    salary: {
      type: Number,
      min: [0, 'Le salaire ne peut pas être négatif'],
    },
    status: {
      type: String,
      enum: ['Actif', 'Inactif', "Période d'essai"],
      default: 'Actif',
    },
    avatar: {
      type: String, // URL de l'avatar (optionnelle)
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Propriété virtuelle : nom complet de l'employé
 */
employeeSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('Employee', employeeSchema);
