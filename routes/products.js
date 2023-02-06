const express = require("express");
const router = express.Router();
var admin = require("firebase-admin");
const slugify = require("slugify");
const upload = require("../config/image_upload");
const db = admin.firestore();
const productsCollection = db.collection("products");

router.get("/", async (req, res) => {
  try {
    const response = await productsCollection.get();
    const products = response.docs.map((doc) => doc.data());
    res.send(products);
  } catch (error) {
    res.send(error);
  }
});

router.post("/", upload.single("banner"), (req, res) => {
  const db = admin.firestore();
  const usersCollection = db.collection("products");

  //Generate slug with filter and replace spaces with dashes
  const slug = slugify(req.body.title, {
    replacement: "-",
    remove: /[*+~.()'"!:@]/g,
    lower: true,
  });
  const url = req.protocol + "://" + req.get("host");
  //Generate Random product id
  const productId =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  //Generate Random number for SKU
  const sku = Math.floor(Math.random() * 1000000);

  //Insert a new document into the collection
  usersCollection.doc(productId).set({
    title: req.body.title,
    slug: slug,
    description: req.body.description,
    price: req.body.price,
    image: url + "/storage/" + req.file.filename,
    vendor: req.body.vendor,
    status: req.body.status,
    sku: sku,
    salePrice: req.body.salePrice,
    bidDate: req.body.bidDate,
    category: req.body.category,
    type: req.body.type,
    featured: req.body.featured,
    language: req.body.language,
    productId: productId,
    company: req.body.company,
    createdAt: new Date().toISOString(),
  });

  //Send response
  res.status(200).send({
    message: "Product registered successfully",
  });
});

// code to get a product by company
router.get("/company/:company", async (req, res) => {
  try {
    const response = await productsCollection

      .where("company", "==", "HarshaWeb")
      .get();
    const product = response.docs.map((doc) => doc.data());
    res.send(product);
  } catch (error) {
    res.send(error);
  }
});

// code to get a product by id
router.get("/:id", async (req, res) => {
  try {
    const response = await productsCollection.doc(req.params.id).get();
    const product = response.data();
    res.send(product);
  } catch (error) {
    res.send(error);
  }
});

// code to get a product by slug
router.get("/slug/:slug", async (req, res) => {
  try {
    const response = await productsCollection

      .where("slug", "==", req.params.slug)
      .get();
    const product = response.docs.map((doc) => doc.data());
    res.send(product);
  } catch (error) {
    res.send(error);
  }
});

// code to get product by sku
router.get("/sku/:sku", async (req, res) => {
  try {
    const response = await productsCollection
      .where("sku", "==", parseInt(req.params.sku))
      .get();
    const product = response.docs.map((doc) => doc.data());
    res.send(product);
  } catch (error) {
    res.send(error);
  }
});

// code to get product by id and update it with updating new image
router.put("/:id", upload.single("banner"), async (req, res) => {
  console.log(req.body);
  try {
    const url = req.protocol + "://" + req.get("host");
    const response = await productsCollection.doc(req.params.id).update({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      image: url + "/storage/" + req.file.filename,
      vendor: req.body.vendor,
      status: req.body.status,
      salePrice: req.body.saleprice,
      bidDate: req.body.bidDate,
      type: req.body.type,
      featured: req.body.featured,
      language: req.body.language,
      company: req.body.company,
      updatedAt: new Date().toISOString(),
    });
    const product = await productsCollection.doc(req.params.id).get();
    res.json({ message: "Product updated successfully", response, product:product.data() });
  } catch (error) {
    res.json({ message: error.message });
  }
});

//Delete a product
router.delete("/:id", async (req, res) => {
  try {
    const response = await productsCollection.doc(req.params.id).delete();
    res.send("Product deleted successfully");
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
