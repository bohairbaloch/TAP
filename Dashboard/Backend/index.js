const express = require("express");
const app = express();
const routes = require("./routes");

app.use(express.json());
app.use("/api", routes);

const PORT = process.env.PORT || 3001;
const path = require("path");

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "../Frontend/dist")));

// Handle any requests that don't match the ones above
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/dist", "index.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
