import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import express from 'express';
import db from './config/db.js';
import { getRoute } from './routes/index.js';
// Crear la app
const app = express()

//Hanilitar lectura de datos de formulario
app.use( express.urlencoded({extended: true}) )

// Habilitar cookieParser
app.use(cookieParser())

// Habilitar csurf
app.use(csrf({cookie:true}))

//Habilitar pug
app.set('view engine', 'pug')
app.set('views','./views')

// Public folder
app.use( express.static('public') )

//Database Connection

try {
    await db.authenticate();
    // db.sync()
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}


//Routing
app.use('/', getRoute('usersRoutes'))
app.use('/auth', getRoute('authRoutes'))

// Define port and run project
const port = 3000;
app.listen(port, ()=>{
    console.log(`server start in port ${port}`);
})