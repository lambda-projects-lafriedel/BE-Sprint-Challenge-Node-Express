const express = require('express');

const Actions = require('../helpers/actionModel');
const Projects = require('../helpers/projectModel');

const router = express.Router();

//GET to /api/actions
router.get('/', async (req, res) => {
    try {
        const actions = await Actions.get();
        res.status(200).json(actions);

    } catch {
        res.status(500).json({error: "There was an error retrieving the actions."});
    }
})

//POST to /api/actions -- want to come back and fix, it doesn't return the 404 if the project id doesn't exist (but at least it doesn't add)
router.post('/', async (req, res) => {
    try { 
        const { project_id, description } = req.body
        if (!project_id || !description) {
            res.status(400).json({message: "Both a project id and action description are required."});
        } else {
            const existingProject = await Projects.get(project_id);
            if (existingProject) {
                const newAction = await Actions.insert(req.body);
            res.status(201).json(newAction);
               
            } else {
                res.status(404).json({message: "A project with that ID does not exist."});
            }
        }
    } catch {
        res.status(500).json({error: "There was an error adding the action."});
    }
})
//PUT to /api/actions/:id
//DELETE to /api/actions/:id

module.exports = router;