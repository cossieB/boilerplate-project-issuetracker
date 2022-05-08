'use strict';
const Issue = require('../model')
const mongoose = require('mongoose')

module.exports = function (app) {

    app.route('/api/issues/:project')
        .get(async function (req, res) {
            await mongoose.connect(process.env.MONGO_URI)
            const fields = ['_id', 'issue_title', 'issue_text', 'created_by', 'assigned_to', 'status_text', 'created_on', 'updated_on', 'open' ]
            let project = req.params.project;
            let query = {}
            for (const prop in req.query) {
                if (fields.includes(prop.toLowerCase())) query[prop] = req.query[prop]
            }
            const result = await Issue.find(query)
            res.json([...result])
        })

        .post(async function (req, res) {
            await mongoose.connect(process.env.MONGO_URI)
            let project = req.params.project;
            const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body
            const issue = new Issue({ ...req.body, open: true, created_on: new Date().toISOString(), updated_on: new Date().toISOString() })
            await issue.save()

            res.json({ assigned_to, status_text, open: true, _id: issue.id, issue_title, issue_text, created_by, created_on: issue.created_on, updated_on: issue.updated_on })

        })

        .put(async function (req, res) {
            await mongoose.connect(process.env.MONGO_URI)
            let project = req.params.project;

            const { _id } = req.body
            const doc = await Issue.findById(_id).catch(() => null)

            if (!doc) {
                mongoose.connection.close()
                return res.json({ error: 'could not update', _id })
            }

            for (const prop in req.body) {
                doc[prop] = req.body[prop] || doc[prop]
            }
            if (req.body.open === false) doc.open = false
            await doc.save()

            res.json({ result: 'succesfully updated', _id })
        })

        .delete(async function (req, res) {
            await mongoose.connect(process.env.MONGO_URI)
            let project = req.params.project;
            const { _id } = req.body

            const result = await Issue.findByIdAndDelete(_id).catch(() => null)
            
            if (result) {
                res.json({result: "successfully deleted", _id})
            }
            else {
                res.json({error: "could not delete", _id})
            }
        });
    mongoose.connection.close()
};
