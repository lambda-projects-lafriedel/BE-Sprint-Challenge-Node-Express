const express = require('express');
const helmet = require('helmet');
const server = express();

const actionsRouter = require('./data/routers/actionsRouter');
const projectsRouter = require('./data/routers/projectsRouter');

server.use(express.json());
server.use(helmet());

server.use('/api/actions', actionsRouter);
server.use('/api/projects', projectsRouter);

module.exports = server;