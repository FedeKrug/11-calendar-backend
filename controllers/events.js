const { response } = require('express');
const Event = require('../models/Event');

const getEvents = async (req, res = response) => {

    const events = await Event.find().populate('user', 'name');
    //Event.find(); encuentra todos los eventos sin necesidad de cumplir alguna condicion
    //.populate(); me permite acceder a todos los datos de una variable asignada
    try {
        res.status(400).json({
            ok: true,
            events
        })
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

const createEvent = async (req, res = response) => {

    //Verificar que tengo el evento
    const event = new Event(req.body);

    try {

        event.user = req.uid;
        const savedEvent = await event.save();

        res.json({
            ok: true,
            event
        })

    }

    catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hablar con el administrador'
        })

    }
}

const updateEvent = async (req, res = response) => {

    const eventId = req.params.id;
    const uid = req.uid;

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe con ese id'
            });
        }

        if (event.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene permitido modificar este evento.'
            });
        }
        const newEvent = {
            ...req.body,
            user: uid
        }
        const updatedEvent = await Event.findByIdAndUpdate(eventId, newEvent);

        res.status(400).json({
            ok: true,
            event: updatedEvent
        })
    }

    catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador.'
        })
    }


}

const deleteEvent = async (req, res = response) => {

    const eventId = req.params.id;
    const uid = req.uid;
    console.log({ req });
    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe con ese id'
            });
        }

        if (event.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene permitido eliminar este evento.'
            });
        }

        await Event.findByIdAndDelete(eventId);

        res.status(400).json({
            ok: true
        })
    }

    catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador.'
        })
    }



}

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
}