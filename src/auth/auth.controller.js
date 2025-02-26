import Usuario from '../users/user.model.js';
import { hash, verify } from 'argon2';
import { generarJWT} from '../helpers/generate-jwt.js';

export const login = async (req, res) => {

    const { email, password, username } = req.body;

    try {
        
        const user = await Usuario.findOne({
            $or: [{ email }, { username }]
        });

        if(!user){
            return res.status(400).json({
                msg: 'Credenciales incorrectas, Correo no existe en la base de datos'
            });
        }

        if(!user.estado){
            return res.status(400).json({
                msg: 'El usuario no existe en la base de datos'
            });
        }

        const validPassword = await verify(user.password, password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'La contraseña es incorrecta'
            });
        }

        const token = await generarJWT( user.id );

        return res.status(200).json({
            msg: 'Inicio de sesión exitoso!!',
            userDetails: {
                username: user.username,
                token: token,
            }
        })

    } catch (e) {
        
        console.log(e);

        return res.status(500).json({
            message: 'Server error',
            error: e.message
        })
    }
}

export const updatePassword = async (req, res) => {
    
    const { email, oldPassword, newPassword } = req.body;

    try {
        // Busca al usuario por su email
        const user = await Usuario.findOne({ email });

        // Si el usuario no existe, responde con un error 404
        if (!user) {
            return res.status(404).json({
                msg: 'Usuario no encontrado'
            })
        }

        // Verifica si la contraseña actual es correcta
        const validPassword = await verify(user.password, oldPassword);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'La contraseña actual es incorrecta'
            })
        }

        // Encripta la nueva contraseña
        const encryptedPassword = await hash(newPassword);
        user.password = encryptedPassword;

        // Guarda el usuario con la nueva contraseña
        await user.save();

        return res.status(200).json({
            msg: 'Contraseña actualizada exitosamente'
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Error al actualizar la contraseña',
            error
        })
    }
}

export const register = async (req, res) => {
    try {

        const data = req.body;

        const encryptedPassword = await hash (data.password);

        const user = await Usuario.create({
            name: data.name,
            surname: data.surname,
            username: data.username,
            email: data.email,
            password: encryptedPassword,
            role: data.role
        })

        return res.status(201).json({
            message: 'User registered successfully',
            userDetails: {
                user: user.email
            }
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'User registration failed',
            error
        })
    }
}