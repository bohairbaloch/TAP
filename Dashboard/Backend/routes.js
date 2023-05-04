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

module.exports = router;
