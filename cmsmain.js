const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const upload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');
const {mongoDbUrl} = require('./config/database');
const passport = require('passport');


// mongoose.Promise = global.Promise;    
// above promise statement of ES6 may be required

mongoose.connect(mongoDbUrl, { useNewUrlParser: true }).then((db) => {

    console.log('MONGO Connected');

}).catch((error) => {

    console.log(error);
});


//static files to be loaded each time during routing
app.use(express.static(path.join(__dirname, 'public')));


//helpers-> hanldebars-helper.js loading
const { select,generateDate, paginate } = require('./helpers/handlebars-helpers');

//Setting view engine
app.engine('handlebars', exphbs({ defaultLayout: 'home', helpers: { select: select, generateDate: generateDate, paginate: paginate } }));  //{select:select} 1st select is just the name, the 2nd is defined above.


app.set('view engine', 'handlebars');


// Upload Middleware
app.use(upload());

//Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method Override to override post require to PUT method in admin-postst/edit.handlebars
app.use(methodOverride('_method')); 


//Sesssion
app.use(session({

    secret: 'Vivek',
    resave: true,
    saveUninitialized: true

}));

app.use(flash());


//Passport
app.use(passport.initialize());
app.use(passport.session());


// Local Variables using middelware
app.use((req,res,next)=>{

    res.locals.user = req.user || null;

    res.locals.success_message = req.flash('success_message');
    
    res.locals.error_message = req.flash('error_message');

    res.locals.error = req.flash('error');

    next();

}); 



//Load routes
const home = require('./routes/home-routes/home-route-file');
const admin = require('./routes/admin-routes/admin-route-file');
const posts = require('./routes/admin-routes/admin-route-posts');
const categories = require('./routes/admin-routes/admin-categories');
const comments = require('./routes/admin-routes/route-comments');


//Use Routes
app.use('/', home);          //loads routes -> home-routes -> home-routes-file
app.use('/admin', admin);    //loads routes -> admin-routes -> admin-routes-file
app.use('/admin-posts', posts);    // This bascially means it loads second parameter 'posts' when url contains something like '/admin-posts'
// loads the corrosponding admin-post-route file for the path '/admin-posts'

app.use('/admin-categories', categories);  //Similar as above
app.use('/route-comments',comments);


const port = 3000 || process.env.PORT;

app.listen(port, () => {
    console.log(`listening through port ${port}`);
});
