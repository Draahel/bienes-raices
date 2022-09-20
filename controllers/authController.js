import { check, validationResult } from "express-validator"
import sendEmail from "../helpers/emails"
import { generarId, generateJWT } from "../helpers/tokens"
import User from "../models/Usuarios"
import bcrypt from 'bcrypt'

const authForm = ( req, res ) => {
    res.render('auth/login',{
        page: 'Iniciar Sesión',
        csrfToken: req.csrfToken()
    })
}

const login = async( req,res ) => {
    const page = 'Iniciar Sesión'
    const { email, password } = req.body

    await check('email').isEmail().withMessage('Email no valido').run(req)
    await check('password').notEmpty().withMessage('Contraseña no debe ir vacía').run(req)

    let results = validationResult(req)

    if (!results.isEmpty()) {
        return res.render('auth/login', {
            page,
            csrfToken: req.csrfToken(),
            errors: results.array(),
            user:{
                email
            }
        })
    }
    // Validar existencia de usuario con email
    const user = await User.findOne({where:{email}})
    if (!user) {
        return res.render('auth/login', {
            page,
            csrfToken: req.csrfToken(),
            errors: [{msg:"Usuario no existe"}],
            user:{
                email
            }
        })
    }
    // Validar si la cuenta está confirmada
    if (!user.confirmed) {
        return res.render('auth/login', {
            page,
            csrfToken: req.csrfToken(),
            errors: [{msg:"Cuenta no confirmada"}],
            user:{
                email
            }
        })
    }
    // Validar Contraseña
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.render('auth/login', {
            page,
            csrfToken: req.csrfToken(),
            errors: [{msg:"Usuario/contraseña invalida"}],
            user:{
                email
            }
        })
    }

    const token = generateJWT({
        id: user.id,
        email: user.email
    })

    // Almacenar el token el una cookie
    return res.cookie("_token", token,{
        httpOnly:true,
        secure: true, //Para sitios https
        sameSite:true,
    }).redirect('mis-propiedades')
}

const registerForm = ( req, res ) => {
    res.render('auth/register',{
        page: 'Crear Cuenta',
        csrfToken: req.csrfToken()
    })
}

const register = async ( req,res ) =>{
    const { name, email, cellphone, password } = req.body
    let token = generarId()
    await check('name').notEmpty().withMessage('Nombre no puede ir vacio').run(req)
    await check('email').isEmail().withMessage('Email no valido').run(req)
    await check('password').isLength({min: 8}).withMessage('Contraseña debe tener minimo 8 caracteres').run(req)
    await check('repeat_password').equals(password).withMessage('Las contraseñas deben coincidir').run(req)
    
    let results = validationResult(req)

    if (!results.isEmpty()) {
        return res.render('auth/register', {
            page: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errors: results.array(),
            user:{
                name,
                email,
                cellphone
            }
        })
    }else{
        const existUser = await User.findOne({where: {email}})
        if (false) {
            return res.render('auth/register', {
                page: 'Crear Cuenta',
                csrfToken: req.csrfToken(),
                errors: [{msg:"Usuario ya existe"}],
                user:{
                    name,
                    email,
                    cellphone
                }
            })
        } else {
            await User.create({
                name,
                email,
                cellphone,
                password,
                token
            });
            await sendEmail({
                name,
                email,
                token}, 1)

            res.render('templates/message',{
                page: 'Cuenta Creada',
                msg: `Se ha enviado un email de confirmación al correo ${email}`
            })
        }
    }

}

const confirmEmail = async( req, res ) =>{
    const page= 'Confirmar Cuenta';
    const { token } = req.params
    const user = await User.findOne({where: {token}})
    
    if (!user) {
        res.render('templates/message',{
            page,
            error:"User not found",
            msg:"Error al confirmar, vuelva a intentarlo"
        })
    } else {
        user.token = null
        user.confirmed = true
        user.save()
        res.render('templates/message',{
            page,
            msg:"Cuenta confirmada con exito!! :D"
        })
    }
}

const forgotPassword = ( req,res ) => {
    res.render('auth/forgotPassword',{
        page: "Olvidé mi contraseña",
        csrfToken: req.csrfToken(),
    })
}

const postForgotPassword = async ( req,res ) => {
    const { email } = req.body

    await check('email').isEmail().withMessage('Email no valido').run(req)
    let results = validationResult(req)

    if (!results.isEmpty()) {
        res.render('auth/forgotPassword',{
            page: "Olvidé mi contraseña",
            csrfToken: req.csrfToken(),
            errors: results.array(),
            email
        })
    } else {
        let user = await User.findOne({ where: { email, confirmed: true } })
        if (!user) {
            res.render('auth/forgotPassword',{
                page: "Olvidé mi contraseña",
                csrfToken: req.csrfToken(),
                errors: [{msg:"No se encontró una cuenta asociada a este correo o no se ha confirmado"}],
                email
            })
        } else {
            const token = generarId()
            user.token = token
            user.save()
            sendEmail({
                email,
                token
            }, 2)
            res.render('templates/message',{
                page: "Olvidé mi contraseña",
                csrfToken: req.csrfToken(),
                msg:"Se ha enviado un correo a su cuenta, porfavor reviselo",
            })
        }
    }
}

const changePassword = async( req,res ) => {
    const page = "Cambiar contraseña"
    const { token } = req.params
    const user = await User.findOne({where: {token}})
    if (!user) {
        res.render('templates/message',{
            page,
            error:"User not found",
            msg:"Hubo un error al intentar cambiar su contraseña, vuelva a intentarlo."
        })
    } else {
        res.render('auth/changePassword',{
            page,
            csrfToken: req.csrfToken()
        })
    }
}

const newPassword = async ( req,res ) => {
    const { new_password } = req.body
    await check('new_password').isLength({min: 8}).withMessage('Contraseña debe tener minimo 8 caracteres').run(req)
    await check('repeat_new_password').equals(new_password).withMessage('Las contraseñas deben coincidir').run(req)
    
    let results = validationResult(req)

    if (!results.isEmpty()) {
        res.render('auth/changePassword',{
            page: "Cambiar contraseña",
            csrfToken: req.csrfToken(),
            errors: results.array(),
        })
    } else {
        const { token } = req.params
        const salt = await bcrypt.genSalt(10)
        const user = await User.findOne({where:{token}})
        user.token = null
        user.password = await bcrypt.hash(new_password, salt);
        await user.save()
        res.render('templates/message',{
            page: "Cambiar contraseña",
            csrfToken: req.csrfToken(),
            msg:"Contraseña cambiada con exito :D"
        })
    }
}
export {
    authForm,
    login,
    registerForm,
    register,
    confirmEmail,
    forgotPassword,
    postForgotPassword,
    changePassword,
    newPassword
}