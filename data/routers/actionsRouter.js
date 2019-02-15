const express = require('express');

const Actions = require('../helpers/actionModel');
const Projects = require('../helpers/projectModel');

const router = express.Router();

//GET to /api/actions -- doublechecked
router.get('/', async (req, res) => {
    try {
        const actions = await Actions.get();
        res.status(200).json(actions);

    } catch {
        res.status(500).json({error: "There was an error retrieving the actions."});
    }
})

//POST to /api/actions -- fixed and doublechecked
router.post('/', async (req, res) => {
    try { 
        const { project_id, description } = req.body;

        if (!project_id || !description) {
            res.status(400).json({message: "Both a project id and action description are required."});
        } else {
            await Projects.get(project_id).then(project => {
                if (project) {
                    Actions.insert(req.body).then(action => {
                        return res.status(201).json(action);
                    });
                };
            }).catch(err => {
                res.status(404).json({message: "A project with that ID does not exist."});
            }
            );
        }
    } catch {
        res.status(500).json({error: "There was an error adding the action."});
    }
})
//PUT to /api/actions/:id -- doublechecked
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { project_id, description } = req.body;

        if (!project_id || !description) {
            res.status(400).json({message: "Both an action id and description are required."});
        } else {
            const updatedAction = await Actions.update(id, req.body);

            if (!updatedAction) {
                res.status(404).json({error: "The action with the specified ID does not exist."});
            } else {
                res.status(200).json(updatedAction);
            }
        }  
    } catch {
        res.status(500).json({error: "There was an error updating the action."});
    }
})
//DELETE to /api/actions/:id
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;

        await Actions.get(id).then(action => {
            if (action) {
                Actions.remove(id).then(deleted => {
                    if (deleted === 1) {
                        return res.status(204).end();
                    };
                });
            }
        }).catch(err => {
            res.status(404).json({error: "The action with the specified ID does not exist."});
        })
    } catch {
        res.status(500).json({error: "There was an error deleting the action."});
    }
    
})

module.exports = router;