const mongoose = require('mongoose')

const IssueScheme = new mongoose.Schema({
    issue_title: {type: String, required: true},
    issue_text: {type: String, required: true},
    created_by: {type: String, required: true},
    project: String,
    assigned_to: {type: String, default: ''},
    status_text: {type: String, default: ''},
    created_on: Date,
    updated_on: Date,
    open: Boolean,

})

const Issue = mongoose.model('issue', IssueScheme)

module.exports = Issue