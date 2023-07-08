const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

const {registerUser, obtenerDatosUsuario, verificarCredenciales}=require('../consultas/consultas')
const {checkCredential, verificacionToken}=require('../middleware/middleware')

router.get('/', (req,res)=>{
    res.send('Servidor en express')
})

router.post('/usuarios', checkCredential, async(req,res)=>{
    try {
        const usuario=req.body
        await registerUser(usuario)
        res.send("Usuario creado con éxito")
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get("/usuarios", verificacionToken, async(req,res)=>{
    try {
        const token= req.header("Authorization").split("Bearer ")[1];
        const { email }=jwt.decode(token)
        const usuario= await obtenerDatosUsuario(email)
        res.json(usuario)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.post('/login', async(req, res)=>{
    try {
        const {email, password}= req.body
        await verificarCredenciales(email, password)
        const token=jwt.sign({email}, process.env.SECRET)
        res.send(token)
    } catch (error) {
        res.status(500).send(error.message)
    }
})


module.exports= router;