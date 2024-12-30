/*
*
*
*       Complete the API routing below
*       
*       
*/



'use strict';
require('dotenv').config();
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {type : String, required: true},
  comments: {type : Array},
  commentcount:{type : Number,default:0}
});

const Book = mongoose.model('ItemModel',bookSchema);

module.exports = async function (app) {

  app.route('/api/books')
    .post(async function (req, res){
      let reqBody = req.body;
      const { title } = reqBody;
      try{
        if ( !title ){
          return res.send('missing required field title');
        }
        const book = new Book({
        title,
        comments: [],
        commentcount: 0
        });
        await book.save();
        return res.json({_id:book._id, title: book.title})
      } catch(err){
        console.log(err);
        return res.status(500).json({error:'Server error'});
      }
    })
    
    .get(async function (req, res){
      let title = req.body.title;
      try{
        const items = await Book.find();
        if (!items) return res.send('no book exists');
        return res.json(items);
      }catch(err){
        return res.status(500).json({error:'Server error'});
      }
    })
    
    .delete(async function(req, res){
      try{
        const items = await Book.deleteMany();
        if(!items) return res.send('no book exists');
        return res.send('complete delete successful');
      }catch(err){
        console.error(err);
        return res.status(500).json({error:'Server error'});
      }
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;
      try{
        if (!bookid) return res.send('no book exists');
        
        const book = await Book.findOne({_id:bookid});
        if (!book) return res.send('no book exists');
        if (!book.comments) book.comments = [];
        return res.json(book);
      }catch(err){
        console.log(err);
        return res.status(500).json({error:'Server error'});
      }
    })
    
    .post(async function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      try{
        if (!bookid) return res.send('no book exists');
        
        if (!comment) return res.send('missing required field comment');

        const book = await Book.findOne({_id : bookid});
        if(!book) return res.send('no book exists');

        book.comments.push(comment);
        book.commentcount++;
        await book.save();
        return res.send(book);
      }catch(err){
        console.error(err);
        return res.status(500).json({error:'Server error'});
      }
    })
    
    .delete(async function(req, res){
      let bookid = req.params.id;
      try{
        if(!bookid) return res.send('no book exists');
        

        const book = await Book.deleteOne({_id:bookid});
        if(!book.deletedCount) return res.send('no book exists');
        return res.send('delete successful');
      }catch(err){
        console.log(err);
        return res.status(500).json({error:'Server error'});
      }
    });

    try{
      await mongoose.connect(process.env.DB);
      console.log('connection successful');
    } catch(err){
      console.log('connection error')
    }
  
};