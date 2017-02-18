const express = require('express');
const app = express();
const Note = require('../models/note.js');
const Article = require('../models/article.js');
const path = require('path');
const cheerio = require("cheerio");
const request = require('request')

module.exports = (app) => {
    function getArticleTitles(object){
        const resultsArray = [];
	    for(var i = 0; i < object.length; i++) {
		    resultsArray.push(object[i].title);
        }
        return resultsArray;
    };
    function saveArticle(scrapedArticle){
        var entry = new Article(scrapedArticle);
        entry.save( (error, articleDoc) => {
            error ? console.log(error) : console.log(`Saved Articles`); // Replacement for if/else statemenet
        })
    };

    app.get('/', (request, response) => {
        const object = {}
        response.render('index', object );
    });
    
    app.get('/carousel', (request, response) => {
        Article.find({}).limit(5).exec( (error, doc) => {
            const articleObject = { articleDoc: doc };
            error ? console.log(error) : response.render('carousel', articleObject);
        })
    });

    app.get('/scrape', (req, res) => {
        Article.find({}, (error, doc) => { return doc; }) // returns object of key/values for title and link
        .then( (articleDoc) => { return getArticleTitles(articleDoc); }) //returns array of titles for duplication checking
        .then( (titleArray) => {     
            request('http://www.lifehacker.com/', (error, response, html) => {
                const $ = cheerio.load(html);
                $('article').each(function(i, element){
                    let newArticle = {};
                    newArticle.title = $(element).children('header').children('h1').children('a').text();
                    newArticle.link = $(element).children('header').children('h1').children('a').attr('href');
                    newArticle.image = $(element).children('div').children('figure').children('a').children('div').children('picture').children('source').data('srcset');
                    let titleCheck = newArticle.title;
                    
                    if( titleArray.includes(titleCheck) ) { return; }
                    else { saveArticle(newArticle);  }
                }); // End of Each
            }); // End of request
        }) // End of 2nd `then`
        res.redirect('/');
    }); // End of Get 'Scrape'


    app.get('/articles', (req, res) =>{
        Article.find({}).populate({
            path: 'note', 
            options: { 
                sort: { 'created_at' : 1 }
            }
        }).exec( (error, doc) => {
            const articleObject = { articleDoc: doc };
            error ? console.log(error) : res.render('landing', articleObject);
        }) // End of Article Find
    }); // End of loading articles

    app.get('/articles/:id', (req, res) => {
        Article.findOne({'_id': req.params.id})
        .populate('Note')
        .exec( (error, articleDoc) => {
            error ? console.log(error) : res.json(articleDoc);
        });
    });

    app.post('/articles/:id', (req, res) => {
        var newNote = new Note(req.body);
        newNote.save( (err, noteDoc) => {
            err ? console.log(err) :
                Article.findOneAndUpdate(
                    { '_id': req.params.id }, 
                    { $push: {'note': noteDoc._id} },
                    (articleError, articleDoc) => {
                       articleError ? console.log(articleError) : res.redirect('/articles');   
                    }
                ) // End of updating Article note
        }); // End of SAVE
    }); // End of Posting Comment

    app.delete('/delete/comment/:id', (req, res) => {
        Note.remove({'_id': req.params.id}, (error) => {
            error ? console.log(error) : res.redirect('/articles');
        })
    });

    app.delete('/delete/article/:id', (req, res) => {
        Article.remove({'_id': req.params.id}, (error) => {
            error ? console.log(error) : res.redirect('/articles');
        })
    });
}; // End of Module.Exports