const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require ('cors');


const app = express();

// allopw cross-origin requests
app.use(cors());

// connect to mongoDB
// Needs to be on mobile data whilst on site for now
mongoose.connect('mongodb://jimtest:test123@ds039291.mlab.com:39291/graphql-play-database');

mongoose.connection.once('open',function(){
    console.log('--- Connection to database success! ---');
        }).on('error', function(error){
            console.log('--- Connection fail:', error);
    });

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
  }));

app.listen(4000, () => {
   console.log('--- Now Listening for requests on port:4000 ---')
  });
