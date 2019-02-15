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
router.post('/', async (req, res) => {
    try { 
        const { name, description } = req.body
        if (!name || !description) {
            res.status(400).json({message: "Both a project name and description are required."});
        } else {
            const newProject = await Projects.insert(req.body);
            res.status(201).json(newProject);
        }
    } catch {
        res.status(500).json({error: "There was an error adding the project."});
    }
})
//PUT to /api/projects/:id
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { name, description } = req.body;

        if (!name || !description) {
            res.status(400).json({message: "Both a project name and description are required."});
        } else {
            const updatedProject = await Projects.update(id, req.body);

            if (!updatedProject) {
                res.status(404).json({error: "The project with the specified ID does not exist."});
            } else {
                res.status(200).json(updatedProject);
            }
        }  
    } catch {
        res.status(500).json({error: "There was an error updating the project."});
    }
})
//DELETE to /api/projects/:id

module.exports = router;