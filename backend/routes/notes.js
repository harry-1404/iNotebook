const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
var fetchuse = require('../middleware/fetchuse');
const { body, validationResult } = require('express-validator');


// Route 1: Get All notes using: Get "/api/notes/fetchuse" , login required
router.get('/fetchallnotes', fetchuse, async (req, res) => {

    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})


// Route 2: Adding notes using: Post "/api/notes/addnotes" , login required
router.post('/addnotes', fetchuse, [
    body('title', 'Enter the valid Title').isLength({ min: 3 }),
    body('description', 'Description mus be atleast 5 charater ').isLength({ min: 5 }),], async (req, res) => {

        try {
            const { title, description, tag } = req.body;

            // If there are errors, bad request and the errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const note = new Note({
                title, description, tag, user: req.user.id
            })
            const saveNote = await note.save();

            res.json(saveNote);
        }
        catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error");
        }
    })

// Route 3: Updating notes using: Post "/api/notes/updateNotes" , login required
router.put('/updatenote/:id', fetchuse, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        // Create a new Object
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        // Find the note to be update and update it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not found") }

        if (note.user.toString() != req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json({ note })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");

    }

})


// Route 4: Deleting notes using: Delete "/api/notes/deletenotes" , login required
router.delete('/deletenotes/:id', fetchuse, async (req, res) => {

    try {


        // Find the note to be update and update it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not found") }

        //Allow to delete if user owns this notes
        if (note.user.toString() != req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Note is deleted", note: note })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");

    }

})




module.exports = router