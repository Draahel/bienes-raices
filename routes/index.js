import usersRoutes from './usersRoutes.js'
import authRoutes from './authRoutes.js'

const ROUTES = {
    USERS: 'usersRoutes',
    AUTH: 'authRoutes'
}

export function getRoute(route){
    switch (route) {
        case ROUTES.USERS:
            return usersRoutes
            break;
        case ROUTES.AUTH:
            return authRoutes
            break;
        default:
            break;
    }
}