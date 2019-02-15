const express = require('express');

const Actions = require('../helpers/actionModel');

const router = express.Router();

//GET to /api/projects
router.get('/', async (req, res) => {
    try {
        const actions = await Actions.get();
        res.status(200).json(actions);

    } catch {
        res.status(500).json({error: "There was an error retrieving the actions."});
    }
})
//GET to /api/projects/:id/actions
//POST to /api/projects
//PUT to /api/projects/:id
//DELETE to /api/projects/:id

module.exports = router;