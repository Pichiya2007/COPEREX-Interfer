export const tieneRole = (...roles) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(500).json({
                success: false,
                msg: 'Se quiere verificar un role sin validar el token primero.'
            })
        }

        if (!roles.includes(req.usuario.role)) {
            return res.status(401).json({
                success: false,
                msg: `No puedes registrarte, solamente el administrador con rol: ${roles} puede hacerlo.`
            })
        }

        next();
    }
}