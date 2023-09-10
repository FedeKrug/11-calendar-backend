/*
    Rutas de Usuarios / Auth
    host + /api/auth
*/

const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { newUserRegister, loginUser, getRenewUser, revalidateToken } = require('../controllers/auth')
const { fieldValidator } = require('../middlewares/field-validator');
const { validateJWT } = require('../middlewares/validate-jwt');

router.post(
    '/new',
    [//middlewares
        check('name', 'El nombre debe ser obligatorio.').not().isEmpty(),
        check('email', 'El email debe ser obligatorio.').isEmail(),
        check('password', 'El password debe ser de al menos 6 caracteres').isLength({ min: 6 }),
        fieldValidator
    ],
    newUserRegister
);

router.post('/',
    [
        check('email', 'El email debe ser obligatorio.').isEmail(),
        check('password', 'El password debe ser de al menos 6 caracteres').isLength({ min: 6 }),
        fieldValidator
    ]
    , loginUser);

//router.get('/renew', validateJWT, getRenewUser);
router.get('/renew', validateJWT, revalidateToken);
//Renovar el JWT

module.exports = router;