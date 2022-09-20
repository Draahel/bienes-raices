import jwt from 'jsonwebtoken'
import config from '../config/config'

export const generateJWT = data => jwt.sign ({id:data.id, email: data.email}, config.JWT_SECRET, {expiresIn: '1h' }) 

export const generarId = ( ) => Math.random().toString(32).substring(2) + Date.now().toString(32)
