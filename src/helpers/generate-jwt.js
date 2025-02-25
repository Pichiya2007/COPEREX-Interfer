import jwt from 'jsonwebtoken';

export const generarJWT = (uid = '') => {  
    return new Promise((resolve, reject) => {
        
        const payload = { uid };

        jwt.sign(
            payload,
            process.env.SECRETORPRIVATEKEY,
            {
                expiresIn: '1h'
            },
            (err, token) => {
                err ? (console.log(err), reject('No se genero el token.')) : resolve(token);
            }
        );
    });
}