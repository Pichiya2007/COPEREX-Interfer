import { Router } from 'express';
import { check } from 'express-validator';
import { addCompany, getCompanies, updateCompany, deleteCompany, getCompaniesA_Z, generarReporte } from './company.controller.js';
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

router.get('/az', getCompaniesA_Z)

router.put(
    '/:id',
    [
        validarJWT,
        tieneRole('ADMIN_ROLE'),
        check('name', 'The name is required').not().isEmpty(),
        validarCampos
    ],
    updateCompany
)

router.delete(
    '/:id',
    [
        validarJWT,
        tieneRole('ADMIN_ROLE'),
    ],
    deleteCompany
)

router.get(
    '/reports',
    [
        validarJWT,
        tieneRole('ADMIN_ROLE')
    ],
    generarReporte
)

export default router;