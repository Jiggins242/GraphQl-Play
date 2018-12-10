const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');

// all the types/ arguments that we need that is provided by graphql
const {GraphQLObjectType,
       GraphQLString,
       GraphQLSchema,
       GraphQLID,
       GraphQLInt,
       GraphQLList,
       GraphQLNonNull
      } = graphql;

// 
const BookType = new GraphQLObjectType({
  name:'Book',
  fields:() => ({
    id:{type: GraphQLID}, // Is input of a string but not intended to be human-readable (such as the ID given in a DB) 
    name:{type: GraphQLString}, // Is input of a string 
    genre:{type: GraphQLString}, // Is input of a string 
    author:{
      type: AuthorType,
      resolve(parent,args){
        //return _.find(authors,{id:parent.authorId});
        return Author.findById(parent.authorId);
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name:'Author',
  fields:() => ({
    id:{type: GraphQLID},
    name:{type: GraphQLString},
    age:{type: GraphQLInt},
    books:{
      type: new GraphQLList(BookType),
      resolve(parent,args){
      //  return _.filter(books, {authorId:parent.id});
      return Book.find({ authorId: parent.id});
      }
    }
  })
});

// This is the API querys and style we will be able to call as well as the connections between them all.
const RootQuery = new GraphQLObjectType({
  name:'RootQueryType',
  fields:{
    book:{
      type: BookType,
      args:{id:{type:GraphQLID}},
      resolve(parent, args){
        // to add code later for DB
      //  return _.find(books,{id:args.id});
      return Book.findById(args.id);
      }
    },

    author: {
      type: AuthorType,
      args:{id:{type: GraphQLID}},
      resolve(parent, args){
       //return _.find(authors,{id:args.id});
       return author.findById(args.id);
      }
    },

    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args){
      //  return books
      return Book.find({});
      }
    },

    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args){
        //return authors
        return Author.find({});
      }
    }
  }
});

// This is adding the data to the Mongodb up in the cloud
// mutation is the word for either adding, updating and removing data from an api call to the DB
// In this example we have only done the add mutation 
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthor:{
      type: AuthorType,
      args:{
        name:{ type: new GraphQLNonNull (GraphQLString)}, // NonNull a value has to be given - think also ! 
        age: { type: new GraphQLNonNull (GraphQLInt)}
      },
      resolve(parent,args){
        let author = new Author({
          name: args.name,
          age: args.age
        });
        return author.save();
      }
   },

   addBook:{
    type:BookType,
    args:{
      name: { type: new GraphQLNonNull (GraphQLString)},
      genre: { type: new GraphQLNonNull (GraphQLString)},
      authorId: { type: new GraphQLNonNull (GraphQLID)} 
    },
    resolve(parent,args){
      let book = new Book({
        name: args.name,
        genre: args.genre,
        authorId: args.authorId
      });
      return book.save();
    }
   }
  }
});

// This is to export this file into the app.js file
module.exports = new GraphQLSchema({
  query:RootQuery,
  mutation:Mutation
});
