// src/middlewares/authenticateToken.js
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const authenticateToken = () => async (req, res, next) => {
  try {
    const { cookies } = req;
    const accessToken = cookies.token;

    // Si no hay token, devuelve un error de autenticación
    if (!accessToken) {
      return res.status(401).json({
        code: -50,
        message: 'No se ha proporcionado un token de acceso'
      });
    }

    // Verificar el token
    const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
    const user = await User.findByPk(decodedToken.id_user);

    // Verificar si el usuario existe
    if (!user) {
      return res.status(401).json({
        code: -70,
        message: 'Token de acceso no válido'
      });
    }

    // Como todos los usuarios son del tipo 'user', asignamos permiso automáticamente
    const hasPermission = true;

    if (!hasPermission) {
      return res.status(403).json({
        code: -10,
        message: 'No tiene los permisos necesarios.'
      });
    }

    // Asignar el usuario autenticado al objeto `req` para usarlo en las rutas
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: 'Ha ocurrido un error al autenticar el token de acceso'
    });
  }
};
