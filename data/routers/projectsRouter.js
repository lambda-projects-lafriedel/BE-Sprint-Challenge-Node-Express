const express = require('express');

const Projects = require('../helpers/projectModel');
const Actions = require('../helpers/actionModel');

const router = express.Router();

//GET to /api/projects -- doublechecked
router.get('/', async (req, res) => {
    try {
        const projects = await Projects.get();
        res.status(200).json(projects);

    } catch {
        res.status(500).json({error: "There was an error retrieving the projects."});
    }
})

//GET to /api/projects/:id/actions -- doublechecked 
router.get('/:id/actions', (req,res) => {
    const id = req.params.id;

    Projects.getProjectActions(id).then(actions => {
        if (actions.length > 0) {
            res.status(200).json(actions);
        } else {
            res.status(404).json({error: "A project with the specified ID does not exist."});
        }
    }).catch(err => {
        res.status(500).json({error: "There was an error retrieving the actions for the project."})
    });
})
//POST to /api/projects -- doublechecked
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
//PUT to /api/projects/:id -- doublechecked
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
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const project = await Projects.get(id);

        if (project) {
            const projectActions = await Projects.getProjectActions(id);

            for (let i = 0; i < projectActions.length; i++) {
                Actions.remove(projectActions[i].id).then(deleted => {
                    if (deleted === 0) {
                        res.status(500).json({error: "There was an error deleting an action for this project."});
                    } else {
                        res.status(204).end();
                    }
                });
            };

            await Projects.remove(id).then(deleted => {
                if (deleted === 1) {
                    return res.status(204).end();
                }
            });
        } else {
            res.status(404).json({error: "A project with the specified ID does not exist and therefore cannot be deleted."});
        }
    } catch {
        res.status(500).json({error: "There was an error deleting the project."})
    }
})

module.exports = router;