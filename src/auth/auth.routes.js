import { Router } from 'express';
import { login, register, updatePassword } from './auth.controller.js'
import { registerValidator, loginValidator } from '../middlewares/validator.js';
import { deleteFileOnError } from '../middlewares/delete-file-on-error.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { tieneRole } from '../middlewares/role-validator.js';

const router = Router();

router.post(
    '/login',
    loginValidator,
    login
);

router.put(
    '/updatepassword',
    [
        validarJWT,
        validarCampos
    ],
    updatePassword
);

router.post(
    '/register',
    [
        validarJWT,
        tieneRole('ADMIN_ROLE'),
        registerValidator,
        deleteFileOnError,
        validarCampos
    ],
    register
);

export default router;