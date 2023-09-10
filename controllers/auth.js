const { response } = require('express');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');

const newUserRegister = async (req, res = response) => {
    const { name, email, password } = req.body;


    try {
        let user = await User.findOne({ email });
        console.log('Usuario:', user);

        if (user) {
            return res.json({
                ok: false,
                msg: 'Ya existe un usuario con ese correo'
            })
        }

        user = new User(req.body);

        //Encriptar password
        const salt = bcrypt.genSaltSync();
        //Hago el hash del password
        user.password = bcrypt.hashSync(password, salt);

        await user.save();


        res.status(201).json({
            ok: true,
            msg: 'registro',
            uid: user.id,
            name
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador.'
        })
    }

}


const loginUser = async (req, res = response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        //confirmar passwords
        const validPassword = bcrypt.compareSync(password, user.password);

        if (!user || !validPassword) {
            return res.json({
                ok: false,
                msg: 'Usuario o password incorrectos'
            })
        }


        //Generar Json Web Token (JWT)

        const token = await generateJWT(user.id, user.name);

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })

    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador.'
        })
    }
}





const getRenewUser = (req, res = response) => {

    res.json({
        ok: true,
        msg: 'renew'
    })

}

const revalidateToken = async (req, res = response) => {

    const { uid, name } = req;
    //Generar un nuevo JWT y retornarlo en esta peticion

    const token = await generateJWT(uid, name);
    res.json({
        ok: true,
        msg: 'revalidate Token',
        token
    })
}

module.exports = {
    newUserRegister,
    loginUser,
    getRenewUser,
    revalidateToken
}

