const express = require('express');

const Projects = require('../helpers/projectModel');

const router = express.Router();

//GET to /api/projects
router.get('/', async (req, res) => {
    try {
        const projects = await Projects.get();
        res.status(200).json(projects);

    } catch {
        res.status(500).json({error: "There was an error retrieving the projects."});
    }
})
//POST to /api/projects
//PUT to /api/projects/:id
//DELETE to /api/projects/:id

module.exports = router;