// See https://github.com/typicode/json-server#module
const jsonServer = require("json-server");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const server = jsonServer.create();
const filePath = path.join("db.json");

// Read the db.json file to support write operations
let db;
if (fs.existsSync(filePath)) {
  const data = fs.readFileSync(filePath, "utf-8");
  db = JSON.parse(data);
} else {
  db = {}; // Fallback if db.json doesn't exist
}
const router = jsonServer.router(db);

const middlewares = jsonServer.defaults();

// Enable CORS for all origins
server.use(cors());

// Add middleware to handle JSON bodies for POST/PUT requests
server.use(jsonServer.bodyParser);

// Optional: Add custom routes or rewrites before the default router
server.use(
  jsonServer.rewriter({
    "/api/*": "/$1", // Rewrite /api/xyz to /xyz
    "/blog/:resource/:id/show": "/:resource/:id", // Example of custom rewrites
  })
);

// Handle POST requests explicitly
server.use((req, res, next) => {
  if (req.method === "POST") {
    req.body.createdAt = new Date().toISOString(); // Automatically add a timestamp
  }
  next(); // Continue to JSON Server router
});

// Use the default middlewares and the router
server.use(middlewares);
server.use(router);

// Start the server
server.listen(3000, () => {
  console.log("JSON Server is running on port 3000");
});

// Export the Server API
module.exports = server;
