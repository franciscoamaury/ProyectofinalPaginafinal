const express = require('express')
const mysql = require('mysql')
const app = express()
const port = process.env.PORT || 3000
const nodemailer = require('nodemailer')

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}));

app.get('/NuestraHistoria', (req, res) => res.render('pages/Sobrenosotros'))
app.get('/Equipo', (req, res) => res.render('pages/Equipo'))
app.get('/Almuerzo', (req, res) => res.render('pages/Almuerzo'))
app.get('/Cena', (req, res) => res.render('pages/Cena'))
app.get('/Bebidas', (req, res) => res.render('pages/Bebidas'))
app.get('/Postres', (req, res) => res.render('pages/potres'))
app.get('/', (req, res) => res.render('pages/index'))

app.get('/Contactos', (req, res) => res.render('pages/Contactos'))
app.get('/privacy', (req, res) => res.render('pages/Privacy_Policy'))
//Conexion
const connection = mysql.createConnection({
    connectionLimit:5000,
    host: 'freedb.tech',
    user: 'freedbtech_francisco',
    password: 'pepe123456',
    database: 'freedbtech_trabajoFinalFranciscoDB'
})


//check connect
connection.connect(error => {
    if (error) throw error;
    console.log('Database running');
})

 app.get('/resultado', (req, res) => {
     const sql = 'Select * From Usuarios';

     connection.query(sql, (error, results) => {
         if (error) {
             throw error;
         }
         res.render('pages/Clientes', {
             'results': results
         })
     } )  
 });

 app.get('/Reservaciones', (req, res) => res.render('pages/Reservaciones'))

 app.post('/Reservaciones', (req, res) => {
     const sql = `SELECT * FROM Usuarios WHERE correo ='${req.body.correo}'`;
     const sql2 = 'INSERT INTO Usuarios SET ?';

     const {nombre, correo, telefono, mensaje} = req.body;

     contentHTML = `
         <h1>Info Usuario</h1>
         <ul>
        <li> nombre: ${nombre} </li>
        <li> correo: ${correo} </li>
         <li> telefono: ${telefono} </li>
         </ul>
         <p> ${mensaje} </P>
     `
     const transporter = nodemailer.createTransport({
         service: 'gmail' ,
         auth: {
             user: 'ppedrojuan0376@gmail.com',
             pass: 'Pepe123456'
         }
     })
     const info = {
         from: 'ppedrojuan0376@gmail.com',
         to: 'pepegrillo0272@gmail.com',
         subject: 'formulario de contacto',
         html: contentHTML
     }

     connection.query(sql, (error, results) => {
        if (error) {
            throw error;
        }
        if(!results.length > 0){
             const usuariosObj = {
                 Nombre: req.body.nombre,
                 Correo: req.body.correo,
                 Telefono: req.body.telefono
             }
        
             connection.query(sql2, usuariosObj, error => {
                 if (error) {
                     throw error;
                 }
                
             })
         } 
          //enviar correo
          transporter.sendMail(info, error =>{
             if(error){
                 throw error; 
               } else {
                   console.log('emial enviado')
               }
          })
        
     } )  
 res.render('pages/index')
 })

app.listen(port, () => console.log("server running"))