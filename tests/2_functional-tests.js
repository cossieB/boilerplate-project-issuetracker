
const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
    let _id
    suite("POST requests", function () {
        test('All fields', function (done) {
            chai
                .request(server)
                .post('/api/issues/apitest')
                .send({
                    'issue_title': 'Issue 1',
                    'issue_text': '1st test',
                    'created_by': 'John Doe',
                    'assigned_to': 'Jonathan Doe',
                    'status_text': 'Status Msg'
                })
                .end((err, res) => {
                    _id = res.body._id
                    assert.equal(res.status, 200)
                    assert.isObject(res.body)
                    assert.property(res.body, 'created_on')
                    assert.property(res.body, 'issue_title')
                    assert.property(res.body, 'issue_text')
                    assert.property(res.body, 'created_by')
                    assert.property(res.body, 'status_text')
                    assert.property(res.body, 'assigned_to')
                    assert.property(res.body, '_id')
                    assert.property(res.body, 'updated_on')
                    done()
                })
        })

        test('Only required fields', function (done) {
            chai
                .request(server)
                .post('/api/issues/apitest')
                .send({
                    'issue_title': 'Issue 2',
                    'issue_text': '2nd test',
                    'created_by': 'Johnny Doe'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.isObject(res.body)
                    assert.property(res.body, 'created_on')
                    assert.property(res.body, 'issue_title')
                    assert.property(res.body, 'issue_text')
                    assert.property(res.body, 'created_by')
                    assert.property(res.body, 'status_text')
                    assert.property(res.body, 'assigned_to')
                    assert.property(res.body, '_id')
                    assert.property(res.body, 'updated_on')
                    done()
                })
        })

        test('Missing required fields', function (done) {
            chai
                .request(server)
                .post('/api/issues/apitest')
                .send({
                    'issue_title': 'Issue 2',
                })
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.isObject(res.body)
                    assert.property(res.body, 'error')
                    assert.equal(res.body.error, 'required field(s) missing')
                    done()
                })
        })
    })

    suite('GET requests', function () {
        test('View issues on a project', function (done) {
            chai
                .request(server)
                .get('/api/issues/apitest')
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.isArray(res.body)
                    done()
                })
        })

        test('View issues on a project with 1 filter', function (done) {
            chai
                .request(server)
                .get('/api/issues/apitest?created_by=JohnDoe')
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.isArray(res.body)
                    done()
                })
        })

        test('View issues on a project with multiple filters', function (done) {
            chai
                .request(server)
                .get('/api/issues/apitest?created_by=JohnDoe&assigned_to=Joe')
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.isArray(res.body)
                    done()
                })
        })
    })

    suite('PUT requests', function () {
        test('Update one field on an issue', function (done) {
            chai
                .request(server)
                .put('/api/issues/apitest')
                .send({
                    '_id': '62780af3958d4721de973044',
                    'issue_text': 'update test',
                })
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.isObject(res.body)
                    assert.property(res.body, 'result')
                    assert.property(res.body, '_id')
                    done()
                })
        })
        test('Update multiple fields on an issue', function (done) {
            chai
                .request(server)
                .put('/api/issues/apitest')
                .send({
                    "_id": '62780af3958d4721de973044',
                    'issue_title': 'Issue 2',
                    'issue_text': '2nd test',
                    'created_by': 'Johnny Doe'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.isObject(res.body)
                    assert.property(res.body, 'result')
                    assert.property(res.body, '_id')
                    done()
                })
        })
        test('Update with missing _id', function (done) {
            chai
                .request(server)
                .put('/api/issues/apitest')
                .send({
                    'issue_title': 'Issue 2',
                    'issue_text': '2nd test',
                    'created_by': 'Johnny Doe'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.isObject(res.body)
                    assert.property(res.body, 'error')
                    done()
                })
        })

        test('no fields to update', function (done) {
            chai
                .request(server)
                .put('/api/issues/apitest')
                .send({
                    "_id": '62780af3958d4721de973044',
                })
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.isObject(res.body)
                    assert.property(res.body, 'error')
                    assert.equal(res.body.error, 'no update field(s) sent')
                    done()
                })
        })
        test('invalid _id', function (done) {
            chai
                .request(server)
                .put('/api/issues/apitest')
                .send({
                    "_id": 'ddd',
                    'issue_title': 'Issue 2',
                    'issue_text': '2nd test',
                    'created_by': 'Johnny Doe'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.isObject(res.body)
                    assert.property(res.body, 'error')
                    done()
                })
        })
    })
    suite('DELETE requests', function () {
        test('valid delete request', function (done) {
            chai
                .request(server)
                .delete('/api/issues/apitest')
                .send({
                    _id
                })
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.property(res.body, 'result')
                    assert.property(res.body, '_id')
                    done()
                })
        })
        test('invalid _id', function (done) {
            chai
                .request(server)
                .delete('/api/issues/apitest')
                .send({
                    '_id': 'dsddf'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.property(res.body, 'error')
                    assert.property(res.body, '_id')
                    done()
                })
        })
        test('missing _id', function (done) {
            chai
                .request(server)
                .delete('/api/issues/apitest')
                .send({
                    '_id': ''
                })
                .end((err, res) => {
                    assert.equal(res.status, 200)
                    assert.deepEqual(res.body, { error: 'missing _id' })
                    done()
                })
        })

    })
});