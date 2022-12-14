import { DataTypes } from "sequelize";
import db from "../config/db.js";
import bcrypt from 'bcrypt'

const User = db.define('users',{
    // Nombre, correo, celular, contraseña
    name:{
        type:DataTypes.STRING,
        allowNull: false
    },
    email:{
        type:DataTypes.STRING,
        allowNull: false
    },
    phone: { type: DataTypes.STRING },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    token: {type: DataTypes.STRING},
    confirmed: {type: DataTypes.BOOLEAN},
},{
    hooks:{
        beforeCreate: async function(user){
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(user.password, salt);
        }
    }
})

export default User