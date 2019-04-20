const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');

const Schema = mongoose.Schema;

const PostSchema = new Schema({

        user:{

            type: Schema.Types.ObjectId,
            ref: 'users'
        },

        category:{

            type: Schema.Types.ObjectId,
            ref: 'categories'

        },
        
        title:{

            type: String,
            required: true
        },

        slug:{
            
            type: String
        },
        
        status:{
            type: String,
            default: 'public'
        },

        allowComments:{
            type: Boolean,
            required: true
        },

        body:{
            type: String,
            required: true
        },

        file:{
            type: String
        },

        date: {
            type: Date,
            default: Date.now()
        },

        comments: [{

            type: Schema.Types.ObjectId,
            ref: 'comments'
        }]
        
});

PostSchema.plugin(URLSlugs('title',{field: 'slug'}));

module.exports =  mongoose.model('posts',PostSchema); 

//here 'posts' is the model name(i.e., name of the table)  given to schema which can be named anything
//it actually creates a collection (i.e., table) in mongodb