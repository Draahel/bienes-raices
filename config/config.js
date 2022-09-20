import dotenv from 'dotenv'
dotenv.config({path:'.env'})

const config = {
    DB_NAME : process.env.DB_NAME,
    DB_USER : process.env.DB_USER,
    DB_PASSWORD : process.env.DB_PASSWORD,
    DB_PORT : process.env.DB_PORT,
    DB_HOST : process.env.DB_HOST,
    EMAIL_HOST:process.env.EMAIL_HOST,
    EMAIL_PORT:process.env.EMAIL_PORT,
    EMAIL_USER:process.env.EMAIL_USER,
    EMAIL_PASS:process.env.EMAIL_PASS,
    URL_APP:process.env.URL_APP,
    JWT_SECRET : process.env.JWT_SECRET,
}

export default config;