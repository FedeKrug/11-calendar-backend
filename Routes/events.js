/*
    Event Routes
    /api/events
*/

const { Router } = require("express");
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');
const { validateJWT } = require('../middlewares/validate-jwt');
const { check } = require('express-validator');
const { fieldValidator } = require("../middlewares/field-validator");
const { isDate } = require("../helpers/isDate");


const router = Router();

//Todas tienen que pasar por la validacion del jwt
router.use(validateJWT);

//Obtener eventos
router.get('/', getEvents);

//Crear un nuevo evento
router.post('/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'La fecha de inicio es requerida').custom(isDate),
        check('end', 'La fecha de finalizacion es requerida').custom(isDate),
        fieldValidator
    ],
    createEvent);

//Actualizar evento
router.put('/:id',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'La fecha de inicio es requerida').custom(isDate),
        check('end', 'La fecha de finalizacion es requerida').custom(isDate),
        fieldValidator
    ]
    , updateEvent);

//Eliminar evento
router.delete('/:id', deleteEvent);

//CRUD:
//create - reload - update - delete

module.exports = router;