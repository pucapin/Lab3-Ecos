const express = require("express");
const path = require("path");

const app = express();
app.use(express.json())

app.use("/client", express.static(path.join(__dirname, "client")))
app.use("/store", express.static(path.join(__dirname, "store")))
app.use("/rider", express.static(path.join(__dirname, "rider")))



let users = []

app.get("users", (req, res) => {

    res.status(200).send(users)
})

app.post("/login", (req, res)=> {
    // extraer datos del body
    const { username, password} = req.body
    // buscar en mis usuarios el usuario que coincide con el username quellegó en el body
    const userFound = users.find(user => user.username === username )
    // si no hay usuario wur coincida entonces responder al cliente en error 400
    if(!userFound) {
        res.status(400).send("lo siento no existe tu ususario")
        return;
    }
    // si lo encontró entonces verificar si la contraseña coincide con la que lleg{o en el body}
    if(userFound.password === password){
        // si si coincide entonces retornar el cliente un 200 diciendo que el usuario se loggeo correctamente
        res.status(200).send({message: "loggeado con éxito"})
        return
    }else{
          res.status(400).send("password incorrecta")
          return
    }
})

app.get('/tiendas/cali/:id_store/:id_item', (req, res) => {
    const {id_store, id_item} = req.params
    res.send({idStore: id_store, idItem: id_item})
})

app.get('/tiendas/cali/:id_store', (req, res) => {
    const idStore = req.params.id_store
    res.send({message: "Hola desde POST", idStore: idStore})
})

app.get('/login', (req, res) => {
    const username = req.body.username
    res.send({message: `Hola ${username}, bienvenid@ :3`})
})

app.post('/register', (req, res) => {
    const username = req.body.username
    res.send({message: `Registrado correctamente, hola ${username}, bienvenid@ :3`})
    users.push(username)
    console.log(users)
})
app.post('/users', (req, res) => {
    const newUser = req.body
    users.push(newUser)
    res.status(201).send(newUser)
})

app.listen(8080, () => {
    console.log("Servidor corriendo en el puerto 8080 !")
})
