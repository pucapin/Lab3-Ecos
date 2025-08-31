const express = require("express");
const path = require("path");
const fs = require("fs");
// File system module que permite leer y escribir archivos

const usersFilePath = path.join(__dirname, "db", "users.json");
const storesFilePath = path.join(__dirname, "db", "stores.json");
const productsFilePath = path.join(__dirname, "db", "products.json");

const app = express();
app.use(express.json())

app.use("/login", express.static(path.join(__dirname, "home")))
app.use("/client", express.static(path.join(__dirname, "client")))
app.use("/store", express.static(path.join(__dirname, "store")))
app.use("/rider", express.static(path.join(__dirname, "rider")))

function readUsers() {
    const data = fs.readFileSync(usersFilePath, "utf-8");
    // readFileSybc -> lee el archivo
    // utf-8 -> encoding
    return JSON.parse(data);
}
function readStores() {
    const data = fs.readFileSync(storesFilePath, "utf-8");
    return JSON.parse(data)
}
function readProducts() {
    const data = fs.readFileSync(productsFilePath, "utf-8");
    console.log(data)
    return JSON.parse(data)
}

app.post("/login", (req, res) => {
    // extraer datos del body
    const { username, password } = req.body

    // buscar en mis usuarios el usuario que coincide con el username quellegó en el body

    const users = readUsers();
    console.log(users)
    const userFound = users.find(user => user.username === username)

    // si no hay usuario wur coincida entonces responder al cliente en error 400

    if (!userFound) {
        res.status(400).send("User not found :(")
        return;
    }

    // si lo encontró entonces verificar si la contraseña coincide con la que lleg{o en el body}

    if (userFound.pass === password) {
        // si si coincide entonces retornar el cliente un 200 diciendo que el usuario se loggeo correctamente
        res.status(200).send({ 
            message: "Succesful Login",
            role: userFound.role,
            userId: userFound.userId,
            username: userFound.username,
            storeId: userFound.storeId
         })
        return
    } else {
        res.status(400).send("Incorrect Password")
        return
    }
})

app.get('/store/:storeId/products', (req, res) => {
    const { storeId } = req.params
    const products = readProducts();
    const storeProducts  = products.filter(p => p.storeId == storeId);
    if(storeProducts) {
        res.status(200).send(
            {message: "Store products found",
            products: storeProducts
            })
    }
})

app.post('/store/:storeId/products', (req, res) => {
    const { storeId } = req.params
    const productData = req.body
    const products = readProducts()
    const newProduct = {
        prodId: 20,
        storeId: parseInt(storeId),
        name: productData.name,
        price: productData.price,
        description: productData.description,
        img: productData.img,
    }
    products.push(newProduct);
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    res.status(201).json(newProduct);
})

app.put('/store/:storeId', (req, res) => {
     try {
    const { storeId } = req.params;
    const storeData = req.body;

    const stores = readStores();
    const store = stores.find((store) => store.storeId == storeId)
    store = {
        ...store,
        ...storeData, //añadir actualizaciones
    }

    fs.writeFileSync(storesFilePath, JSON.stringify(stores, null, 2));
    res.status(200).json(stores[index]);
  } catch (err) {
    console.error("Error editing store:", err);
    res.status(500).json({ error: err.message });
  }
})

app.get('/login', (req, res) => {
    const username = req.body.username
    res.send({ message: `Hola ${username}, bienvenid@ :3` })
})

app.post('/register', (req, res) => {
    const username = req.body.username
    res.send({ message: `Registrado correctamente, hola ${username}, bienvenid@ :3` })
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
