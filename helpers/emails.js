import nodemailer from 'nodemailer'
import config from '../config/config';


async function sendEmail(data, action){
    let transporter = nodemailer.createTransport({
        host: config.EMAIL_HOST,
        port: config.EMAIL_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
          user: config.EMAIL_USER, // generated ethereal user
          pass: config.EMAIL_PASS, // generated ethereal password
        },
    });

    let emailInfo = getTemplate(data, action)
    await transporter.sendMail({
        from: data.email, // sender address
        to: data.email, // list of receivers
        subject: emailInfo.subject, // Subject line
        text: emailInfo.html, // plain text body
        html: emailInfo.html, // html body
    });
}

function getTemplate(data, action){
    const { token } = data
    switch (action) {
        case 1:
            const { name } = data
            return {
                subject:"Welcome to BienesRaices",
                html:`<b>${name}, We needs that you confirm your mail through the following link: <a href="${config.URL_APP}/auth/confirm/${token}">Confirmar Cuenta<a> </b>`
            }
        case 2:
            return {
                subject:"Change Passowrd",
                html:`<b>Change your password through the following link: <a href="${config.URL_APP}/auth/change-password/${token}">Cambiar contraseña<a></b>`
            }
        default:
            return {
                subject: "No submit",
                html: `<b>No found</b>`
            }
    }
}

export default sendEmail;