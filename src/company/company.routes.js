import { Router } from 'express';
import { check } from 'express-validator';
import { addCompany, getCompanies, generarReporte } from './company.controller.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { tieneRole } from '../middlewares/role-validator.js';

const router = Router();

router.post(
    '/',
    [
        validarJWT,
        tieneRole('ADMIN_ROLE'),
        check('name', 'The name is required').not().isEmpty(),
        validarCampos
    ],
    addCompany
)

router.get('/', getCompanies)

router.get(
    '/reports',
    [
        validarJWT,
        tieneRole('ADMIN_ROLE')
    ],
    generarReporte
)

export default router;