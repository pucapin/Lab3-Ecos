const express = require("express");
const path = require("path");
const fs = require("fs");
// File system module que permite leer y escribir archivos

const usersFilePath = path.join(__dirname, "db", "users.json");
const storesFilePath = path.join(__dirname, "db", "stores.json");
const productsFilePath = path.join(__dirname, "db", "products.json");
const ordersFilePath = path.join(__dirname, "db", "orders.json");

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
    return JSON.parse(data);
}
function readProducts() {
    const data = fs.readFileSync(productsFilePath, "utf-8");
    console.log(data)
    return JSON.parse(data)
}
function readOrders() {
    const data = fs.readFileSync(ordersFilePath, "utf-8")
    return JSON.parse(data);
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

// Store methods

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
}) // Get store products

app.get('/store/:storeId', (req, res) => {
    const { storeId } = req.params;
    const stores = readStores();
    const store = stores.find(store => store.storeId == storeId);
    res.status(200).send({
        name: store.name,
        storeId: store.storeId,
        desc: store.desc,
        state: store.state,
        address: store.address,
        products: store.products
    })
}) // Get store

app.post('/store/:storeId/products', (req, res) => {
    const { storeId } = req.params
    const productData = req.body
    const products = readProducts()
    const newProduct = {
        prodId: productData.prodId,
        storeId: parseInt(storeId),
        name: productData.name,
        price: productData.price,
        description: productData.description,
        img: productData.img,
    }
    products.push(newProduct);
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    res.status(201).json(newProduct);
}) // Añadir nuevo producto

app.put('/store/:storeId', (req, res) => {
     try {
    const { storeId } = req.params;
    const storeData = req.body;

    const stores = readStores();
    const store = stores.find((store) => store.storeId == storeId)
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }
    Object.assign(store, storeData);

    fs.writeFileSync(storesFilePath, JSON.stringify(stores, null, 2));
    res.status(200).json(store);
  } catch (err) {
    console.error("Error editing store:", err);
    res.status(500).json({ error: err.message });
  }
}) // Editar info de la tienda, abrir y cerrarla

app.delete('/store/:storeId/products/:prodId', (req, res) => {
    try {
        const { storeId, prodId } = req.params;
        const products = readProducts();
        const product = products.find((p) => p.storeId == storeId && prodId == prodId);
        if(!product) {
            return res.status(404).send({
                error: "Product not found"
            });
        }
        const updatedProducts = products.filter(
            (p) => !(p.storeId == storeId && p.prodId == prodId))
            // filtrar el producto del array, quitarlo
        fs.writeFileSync(productsFilePath, JSON.stringify(updatedProducts, null, 2))
        res.status(200).send({
            message: "Product deleted",
            deleted: product
        })

    } catch (err) {
        res.status(500).send({
            error: "Error deleting product"
        })
    }
}) // Eliminar un producto de la tienda

app.get('/stores', (req, res) => {
    const stores = readStores();
    res.status(200).send({ 
        stores
     })
}) // Get all stores

app.get('/users/:userId', (req, res) => {
    const { userId } = req.params;
    const users = readUsers();
    const user = users.find(user => user.userId == userId);
    res.status(200).send( {
        user
    })
})

app.get('/products/:prodId', (req, res) => {
    const {prodId} = req.params;
    const products = readProducts();
    const product = products.find( product => product.prodId == prodId);
    if(!product) {
        res.status(400).send({
            message: "Product not found"
        })
    }
    res.status(200).send({
        product
    })
})
// Get specific product
app.delete('/users/:userId/cart/:prodId', (req, res) => {
    const { userId, prodId} = req.params;
    const users = readUsers();
    const user = users.find(user => user.userId == userId);
    if (!user) {
    return res.status(404).send({ message: "User not found" });
    }
    const item = user.cart.find(i => i.prodId == prodId);
    if (!item) {
        return res.status(404).send({ message: "Product not in cart" });
    }

    user.cart = user.cart.filter(i => i.prodId != prodId);
    
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    
    res.status(200).send({
        message: "Item removed",
        deleted: item
    })

})
// Eliminar producto del carrito

app.post('/users/:userId/cart/:prodId', (req,res) => {
    const { userId, prodId} = req.params;
    const products = readProducts();
    const users = readUsers()
    const user = users.find(user => user.userId == userId);
    if (!user) {
    return res.status(404).send({ message: "User not found" });
    }
    const product = products.find(product => product.prodId == prodId);
    const newProduct = {
        prodId: product.prodId,
        name: product.name,
        price: product.price
    }
    user.cart.push(newProduct);
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    res.status(200).send({
        message: "Item added to cart",
        added: product.prodId
    })

}) // Añadir producto al carrito

app.get('/orders', (req, res) => {
    const orders = readOrders();
    res.status(200).send({
        orders
    })
}) // Obtener todas las ordenes

app.get('/orders/:riderId', (req, res) => {
    const { riderId } = req.params;
    const orders = readOrders();
    const riderOrders = orders.filter(o => o.riderId == riderId);
    if (riderOrders.length === 0) {
        return res.status(404).send({ message: "No orders found for this rider" });
    }
    res.status(200).send({ orders: riderOrders });
}) // Obtener todas las ordenes
app.post('/orders', (req, res) => {
    const data = req.body;
    if(!data) {
        return res.status(404).send({ message: "Order data not found" });
    }
    const orders = readOrders();
    const users = readUsers();
    const user = users.find(u => u.userId == data.userId);
    if(!user) {
        return res.status(404).send({ message: "User not found" });
    } else {
        user.orders = user.orders || [];
        user.orders.push(data.orderId);
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

    }
    orders.push(data);
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));
    res.status(200).send({
        message: "New order created",
        order: data
    })

})

app.get('/orders/:userId', (req, res) => {
  const { userId } = req.params;
  const orders = readOrders();

  const userOrders = orders.filter(order => order.userId == userId);

  if (userOrders.length === 0) {
    return res.status(200).send({
      message: "No orders found",
      orders: []
    });
  }

  res.status(200).send({
    orders: userOrders
  });
}); // Get user orders

app.get("/users/:userId/orders", (req, res) => {
  const { userId } = req.params;
  const users = readUsers();

  const user = users.find(u => u.userId == userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(user.orders || []);
}); // Get rider orders

app.delete('/orders/:orderId', (req, res) => {
  const { orderId } = req.params;
  const orders = readOrders();

  const completedOrder = orders.find(o => o.orderId == orderId);
  if (!completedOrder) {
    return res.status(404).send({ message: "Order not found" });
  }
  const updatedOrders = orders.filter(
    (o) => !(o.orderId == orderId)
  );
  fs.writeFileSync(ordersFilePath, JSON.stringify(updatedOrders, null, 2));

  const users = readUsers(); 
  const rider = users.find(u => u.userId == completedOrder.riderId);
  if (rider && rider.orders) {
    rider.orders = rider.orders.filter(o => o.orderId != orderId);
  }
  const user = users.find(u => u.userId == completedOrder.userId);
  if (user && user.orders) {
    user.orders = user.orders.filter(o => o.orderId != orderId);
  }
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  res.status(200).send({ message: "Order deleted successfully" });
});

app.post('/orders/:orderId/assign', (req, res) => {
  const { orderId } = req.params;
  const { rider, riderId } = req.body;

  const orders = readOrders();
  const users = readUsers();

  const order = orders.find(o => o.orderId == orderId);
  if (!order) return res.status(404).send({ message: "Order not found" });

  if (order.riderId) {
      return res.status(400).send({ message: "Order already assigned" });
  }

  order.riderId = riderId;
  order.rider = rider;

  const newOrder = {
    orderId: order.orderId
  }

  const userRider = users.find(u => u.userId == riderId && u.role === "rider");
  if (userRider) {
    userRider.orders = userRider.orders || [];
    userRider.orders.push(newOrder);
  }

  fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

  res.status(200).send({ message: "Order assigned successfully", order });
});


app.listen(8080, () => {
    console.log("Servidor corriendo en el puerto 8080 !")
})
