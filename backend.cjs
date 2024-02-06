const express = require('express')
const bodyParser= require('body-parser')
// Importing required functions from dbConnection.cjs
const {connectToDb, getDb} = require('./dbconnect.cjs');
const { ObjectId } = require('mongodb');

const app = express()
app.use(bodyParser.json());
let db
connectToDb(function(error) {
    if(error) {
        console.log('Could not establish connection...')
        console.log(error)
    } else {
        const port= process.env.PORT || 8000 
        app.listen(port)
        db = getDb()
        console.log(`Listening on port 8000 ${port}...`)
    }
})
/* -API CALLS
   add entry
   patch entry
   edit entry
   delete entry */
//to add entry we use post
app.post('/add-entry',function(request,response){
    db.collection('expensedb').insertOne(request.body).then(function(){
        response.status(201).json({
            "status":"entry added successfully"
        })
    }).catch(function() {
            response.status(500).json({
                "status":"ERROR"
            })
        })
})
app.get('/get-entry',function(request,response){
   const entries=[]
    db.collection('expensedb').find().forEach(entry =>entries.push(entry)).then(function(){
        response.status(200).json({
            "status":"found"
        })
    })
    .catch(function(){
        response.status(500).json({
            "status":"not fetched"
        })
    })
        
}) //to get or find a data using query
app.delete('/delete-entry',function(request,response){
    if(ObjectId.isValid (request.query.id)){
        db.collection('expensedb').deleteOne({
            _id : new ObjectId(request.query.id)
        }).then(function() {
            response.status(200).json({
                "status" : "Entry successfully deleted"
            })
        }).catch(function() {
            response.status(500).json({
                "status" : "Entry not deleted"
            })
        })
    } else {
        response.status(500).json({
            "status" : "ObjectId not valid"
        })
    }
})
//to update a data using params
app.patch("/update-entry/:id",function(request,response){     // /:id -params with a name (id)
 db.collection('expensedb').updateOne(
    {_id :new ObjectId(request.params.id)} ,// selecting data that ha to be updated
    {$set :request.body} //data to be updated
).then(function(){
    response.status(200).json({
        "status":"updated"
    })
 }).catch(function(){
    response.status(500).json({
        "status":"not updated"
    })
 })
})