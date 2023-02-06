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

// code to update a product by id
router.put("/:productId", async (req, res) => {
  try {
    const response = await productsCollection.doc(req.params.productId);

    const updatedata = await response
      .set(
        {
          title: req.body.title,
          description: req.body.description,
          price: req.body.price,
          saleprice: req.body.saleprice,
          image: req.body.image,
          vendor: req.body.vendor,
          status: req.body.status,
          category: req.body.category,
          type: req.body.type,
          featured: req.body.featured,
          language: req.body.language,
          updatedAt: new Date().toISOString(),
        },
        {
          merge: true,
        }
      )
      .then((res) => {
        console.log(res);
      });
    // res.send(response);
    res.json({ response: response });
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
