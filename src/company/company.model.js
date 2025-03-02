import { Schema, model } from 'mongoose';

const CompanySchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido.'],
        maxLength: [25, 'No puede superar los 25 caracteres.'],
        unique: true
    },
    description: {
        type: String,
        required: [true, 'La descripción es requerida.'],
        maxLength: [100, 'No puede superar los 100 caracteres.']
    },
    impactLevel: {
        type: String,
        required: [true, 'El nivel de impacto es requerido.'],
        enum: ['Bajo', 'Medio', 'Alto']
    },
    yearFoundation: {
        type: Number,
        required: [true, 'El año de funcación es requerida.']
    },
    trajectory: {
        type: Number
    },
    category: {
        type: String,
        required: [true, 'La categoría es requerida.'],
    },
    contact: {
        type: String,
        required: [true, 'El contacto es requerido.'],
    },
    status: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true,
        versionKey: false
    }
);

export default model('Company', CompanySchema);