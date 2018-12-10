const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require ('cors');


const app = express();

// allopw cross-origin requests
app.use(cors());

// connect to mongoDB
// Needs to be on mobile data whilst on site for now - as using cloud for this example - look at NodeJsPlay files for local use of DB
mongoose.connect('mongodb://jimtest:test123@ds039291.mlab.com:39291/graphql-play-database');

// error checking and success message to display to confirm connection to DB - on NodeJsPlay files has a small change for local use 
mongoose.connection.once('open',function(){
    console.log('--- Connection to database success! ---');
        }).on('error', function(error){
            console.log('--- Connection fail:', error);
    });

// when on localhost \graphql we can get to the graphiql screen to practice api calls 
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
  }));

// console out to show what port we are listening on
app.listen(4000, () => {
   console.log('--- Now Listening for requests on port:4000 ---')
  });
