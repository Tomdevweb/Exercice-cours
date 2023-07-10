const express = require("express");
const app = express();

const mongoose = require("mongoose");
const Product = require("./models/Product");
mongoose
  .connect(
    "mongodb+srv://thomasalpacontact:Caperlipopettemec@cluster0.xdklb4t.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

// app.post("/api/products", (req, res, next) => {
//   delete req.body._id;
//   const product = new Products({
//     ...req.body,
//   });
//   product
//     .save()
//     .then((product) => res.status(201).json({ product }))
//     .catch((error) => res.status(400).json({ error }));
// });

app.post("/api/products", (req, res) => {
  // Retrieve the product data from the request body
  const { name, description, price, inStock } = req.body;

  // Create a new Product object using Mongoose model
  const newProduct = new Product({
    name,
    description,
    price,
    inStock,
  });
  // Save the new product to the database
  newProduct
    .save()
    .then((product) => {
      // Return the created product in the response
      res.json({ product });
    })

    .catch((error) => {
      // Handle any errors that occurred during the saving process
      res.status(500).json({ error: "Failed to create product" });
    });
  console.log(newProduct);
});

app.put("/api/products/:id", (req, res, next) => {
  Product.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
});

app.delete("/api/products/:id", (req, res, next) => {
  Product.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Objet supprimé !" }))
    .catch((error) => res.status(400).json({ error }));
});

app.get("/api/products/:id", (req, res, next) => {
  Product.findOne({ _id: req.params.id })
    .then((product) => res.status(200).json(product))
    .catch((error) => res.status(404).json({ error }));
});

//Retourner les produits
app.get("/api/products", (req, res, next) => {
  Product.find()
    .then((products) => res.status(200).json(products))
    .catch((error) => res.status(400).json({ error }));
});

module.exports = app;
