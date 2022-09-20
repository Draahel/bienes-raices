import express from 'express'
// Rounting
const router = express.Router()
router.get('/', (req, res)=>{
    res.send(`Hello world, this is a test.`);
});

router.get('/about', (req, res)=>{
    res.send(`It is about us page.`);
});

export default router