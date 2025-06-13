#!/usr/bin/env node

const debug = require("debug")("apply-juggling-license:server");
const http = require("node:http");
const { app, adminApp } = require("./app");

/**
 * Get port from environment and store in Express.
 */

const port = normalisePort(process.env.PORT ?? "8080");
app.set("port", port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Create admin server that we don't expose publicly.
 */

const adminPort = normalisePort(process.env.ADMIN_PORT ?? port + 1000);
const adminServer = http.createServer(adminApp);
adminServer.listen(adminPort);
adminServer.on("error", onError);
adminServer.on("listening", onListening);

/**
 * Normalise a port into a number, string, or false.
 */

function normalisePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  let bind = "Invalid port";
  if (port !== false) {
    bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  if (addr === null) {
    debug("Address is null, cannot determine listening address");
    return;
  }

  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}

function handle(signal) {
  console.log(`*^!@4=> Received event: ${signal}`);
}
process.on("SIGHUP", handle);

function closeGracefully(signal) {
  console.log(`*^!@4=> Received signal to terminate: ${signal}`);

  server.close(() => {
    console.debug("HTTP server closed");
  });
  adminServer.close(() => {
    console.debug("admin server closed");
  });
  process.exit();
}
process.on("SIGINT", closeGracefully);
process.on("SIGTERM", closeGracefully);

process.on("uncaughtException", (err) => {
  // clean up allocated resources
  server.close();
  adminServer.close();
  // log necessary error details to log files
  console.error(err);
  process.exit(); // exit the process to avoid unknown state
});
