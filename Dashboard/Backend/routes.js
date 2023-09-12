const express = require("express");
const router = express.Router();
const { connect } = require("./db");

router.get("/software", async (req, res) => {
    const db = await connect();
    const software = await db.collection("software").find({}).toArray();
    res.json(software);
});

router.get("/tactics", async (req, res) => {
    const db = await connect();
    const tactics = await db.collection("tactics").find({}).toArray();
    res.json(tactics);
});

router.get("/groups", async (req, res) => {
    const db = await connect();
    const groups = await db.collection("groups").find({}).toArray();
    res.json(groups);
});

router.get("/mitigations", async (req, res) => {
    const db = await connect();
    const mitigations = await db.collection("mitigations").find({}).toArray();
    res.json(mitigations);
});

router.get("/techniques", async (req, res) => {
    const db = await connect();
    const technique = await db.collection("technique").find({}).toArray();
    res.json(technique);
});

router.get("/software/count", async (req, res) => {
  const db = await connect();
  const count = await db.collection("software").countDocuments();
  res.json({ count });
});

router.get("/tactics/count", async (req, res) => {
  const db = await connect();
  const count = await db.collection("tactics").countDocuments();
  res.json({ count });
});

router.get("/groups/count", async (req, res) => {
  const db = await connect();
  const count = await db.collection("groups").countDocuments();
  res.json({ count });
});

router.get("/mitigations/count", async (req, res) => {
  const db = await connect();
  const count = await db.collection("mitigations").countDocuments();
  res.json({ count });
});

router.get("/techniques/count", async (req, res) => {
  const db = await connect();
  const count = await db.collection("technique").countDocuments();
  res.json({ count });
});


module.exports = router;
