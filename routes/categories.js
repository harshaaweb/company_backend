const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

router.post("/", (req, res) => {
  const db = admin.firestore();
  const categoriesCollection = db.collection("categories");
  //    validate data before saving to database
  dataValidation(req, res, () => {
    // check category name is not null
    if (!req.body.name) {
      res.status(400).send({
        message: "Category name is required",
      });
    }
    // check category description is not null
    else if (!req.body.description) {
      res.status(400).send({
        message: "Category description is required",
      });
    }
    // if all data is valid then save to database
    else {
      //Generate Random category id
      const categoryId =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

      //Insert a new document into the collection
      categoriesCollection.doc(categoryId).set({
        name: req.body.name,
        description: req.body.description,
        createdAt: new Date().toISOString(),
      });

      //Send response
      res.status(200).send({
        message: "Category registered successfully",
      });
    }
  });
});

// code for validation of category name and description fields which are required or not null
const dataValidation = (req, res, next) => {
  if (!req.body.name) {
    res.status(400).send({
      message: "Category name is required",
    });
  } else if (!req.body.description) {
    res.status(400).send({
      message: "Category description is required",
    });
  } else {
    next();
  }
};

//Read all categories
router.get("/", async (req, res) => {
  const db = admin.firestore();
  const categoriesCollection = db.collection("categories");
  const categories = await categoriesCollection.get();
  const categoriesArray = [];
  categories.forEach((doc) => {
    categoriesArray.push({
      id: doc.id,
      name: doc.data().name,
      description: doc.data().description,
      createdAt: doc.data().createdAt,
    });
  });
  res.status(200).send(categoriesArray);
});

//Read a category
router.get("/:id", async (req, res) => {
  const db = admin.firestore();
  const categoriesCollection = db.collection("categories");
  const category = await categoriesCollection.doc(req.params.id).get();
  if (!category.exists) {
    res.status(404).send({
      message: "Category not found",
    });
  } else {
    res.status(200).send({
      id: category.id,
      name: category.data().name,
      description: category.data().description,
      createdAt: category.data().createdAt,
    });
  }
});

//Update a category
router.put("/:id", async (req, res) => {
  const db = admin.firestore();
  const categoriesCollection = db.collection("categories");
  const category = await categoriesCollection.doc(req.params.id).get();
  if (!category.exists) {
    res.status(404).send({
      message: "Category not found",
    });
  } else {
    await categoriesCollection.doc(req.params.id).update({
      name: req.body.name,
      description: req.body.description,
    });
    res.status(200).send({
      message: "Category updated successfully",
      category,
    });
  }
});

//Delete a category
router.delete("/:id", async (req, res) => {
  const db = admin.firestore();
  const categoriesCollection = db.collection("categories");
  const category = await categoriesCollection.doc(req.params.id).get();
  if (!category.exists) {
    res.status(404).send({
      message: "Category not found",
    });
  } else {
    await categoriesCollection.doc(req.params.id).delete();
    res.status(200).send({
      message: "Category deleted successfully",
    });
  }
});

module.exports = router;
