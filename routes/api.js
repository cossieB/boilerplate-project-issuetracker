'use strict';
const Issue = require('../model')
const mongoose = require('mongoose');
const res = require('express/lib/response');

module.exports = function (app) {

    try {
        app.route('/api/issues/:project')

            .get(async function (req, res) {
                try {

                    await mongoose.connect(process.env.MONGO_URI)
                    let project = req.params.project;
                    const fields = ['_id', 'issue_title', 'issue_text', 'created_by', 'assigned_to', 'status_text', 'created_on', 'updated_on', 'open']
                    let query = {project}
                    for (const prop in req.query) {
                        if (fields.includes(prop.toLowerCase())) query[prop] = req.query[prop]
                    }
                    const result = await Issue.find(query).select('-project')
                    res.json([...result])
                }
                finally {
                    mongoose.connection.close()
                }
            })

            .post(async function (req, res) {
                try {

                    await mongoose.connect(process.env.MONGO_URI)
                    let project = req.params.project;
                    const { issue_title, issue_text, created_by } = req.body;
                    const assigned_to = req.body.assigned_to || ""
                    const status_text = req.body.status_text || ""
                    const issue = new Issue({ ...req.body, project, open: true, created_on: new Date().toISOString(), updated_on: new Date().toISOString() })
                    console.log(status_text)
                    try {
                        await issue.save()
                    }
                    catch (e) {
                        return res.status(200).json( { error: 'required field(s) missing' } )
                    }
                    res.json({ assigned_to, status_text, open: true, _id: issue.id, issue_title, issue_text, created_by, created_on: issue.created_on, updated_on: issue.updated_on })
                }
                finally {
                    mongoose.connection.close()
                }

            })

            .put(async function (req, res) {
                try {

                    await mongoose.connect(process.env.MONGO_URI)
                    let project = req.params.project;

                    const { _id } = req.body
                    if (!_id) return res.status(200).json({ error: 'missing _id' })

                    const fields = ['issue_title', 'issue_text', 'created_by', 'assigned_to', 'status_text']

                    if (fields.every(item => !(item in req.body))) {
                        return res.status(200).json({ error: 'no update field(s) sent', '_id': _id })
                    }

                    const doc = await Issue.findById(_id).catch(() => null)

                    if (!doc) {
                        mongoose.connection.close()
                        return res.status(200).json({ error: 'could not update', _id })
                    }

                    for (const prop in req.body) {
                        doc[prop] = req.body[prop] || doc[prop] || ''
                    }
                    if (req.body.open === false) doc.open = false
                    doc.updated_on = new Date().toISOString()
                    await doc.save()

                    res.json({ result: 'successfully updated', _id })
                }
                finally {
                    mongoose.connection.close()
                }
            })

            .delete(async function (req, res) {
                try {
                    await mongoose.connect(process.env.MONGO_URI)
                    let project = req.params.project;
                    const { _id } = req.body
                    if (!_id) return res.status(200).json({ error: 'missing _id' })

                    const result = await Issue.findByIdAndDelete(_id).catch(() => null)

                    if (result) {
                        res.json({ result: "successfully deleted", _id })
                    }
                    else {
                        res.status(200).json({ error: "could not delete", _id })
                    }
                }
                finally {
                    mongoose.connection.close()
                }
            });
    }
    catch (e) {
        console.log(e.message)
        res.status(500).json({ error: "Something went wrong" })
    }
};
