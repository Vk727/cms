const express = require('express');
const router = express.Router();
const Post = require('../../models/admin-model-posts');
const Category = require('../../models/admin-model-Category');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


//Middle-ware for Home-page layout

router.all('/*', (req, res, next) => {

    req.app.locals.layout = 'home';
    //here "home" is the name of handlebar layout for admin
    //loads layout for /* in current path from views/layouts/handlebars/home.handlebars
    next();
});




//Home Page
router.get('/', (req, res) => {

    const perPage = 10;
    const page = req.query.page || 1;

    Post.find({})

        .skip((perPage * page) - perPage)
        .limit(perPage)
        .then(posts => {

            Post.countDocuments().then(postCount => {

                Category.find().then(categories => {

                    res.render('home-content/index', { 
                        
                        posts: posts, 
                        categories: categories,
                        current: parseInt(page),
                        pages: Math.ceil(postCount / perPage)

                    });

                });
            });
        });

    //by default looks for the "layouts" folder in "views" directory then "home.handlerbars"
    // i.e., views-> layouts-> home.handlebars to load layout
    //then loads views->home-content->index.handlebar
});




//About Page

router.get('/about', (req, res) => {

    res.render('home-content/about');
    // i.e., views-> layouts-> home.handlebars to load layout
    //then loads views->home-content->about.handlebar
});






// Application Login Page

router.get('/login', (req, res) => {

    res.render('home-content/login');
    // i.e., views-> layouts-> home.handlebars to load layout
    //then loads views->home-content->login.handlebar

});

//Login authentication
passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {

    User.findOne({ email: email }).then(user => {

        if (!user)
            return done(null, false, { message: 'No user found' });

        bcrypt.compare(password, user.password, (err, matched) => {

            if (err) return err;

            if (matched) {

                return done(null, user);
            }

            else {

                return done(null, false, { message: 'Incorrect password' });
            }

        });

    });

}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

router.post('/login', (req, res, next) => {

    passport.authenticate('local', {

        successRedirect: '/admin',
        failureRedirect: '/login',
        failureFlash: true

    })(req, res, next);

});




//Logout Function

router.get('/logout', (req, res) => {

    req.logOut();
    res.redirect('/');

});





//Registeration Page

router.get('/register', (req, res) => {

    res.render('home-content/register');
    // i.e., views-> layouts-> home.handlebars to load layout
    //then loads views->home-content->register.handlebar

});

router.post('/register', (req, res) => {

    let errors = [];

    if (!req.body.firstName) {

        errors.push({ message: 'Please enter your first name' });
    }

    if (!req.body.lastName) {

        errors.push({ message: 'Please enter your last name' });
    }

    if (!req.body.email) {

        errors.push({ message: 'Please enter your email' });

    }

    if (!req.body.password) {

        errors.push({ message: 'Please a enter password' });

    }

    if (!req.body.confirmPassword) {

        errors.push({ message: 'Confirm password cannot be blank' });

    }

    if (req.body.password !== req.body.confirmPassword) {

        errors.push({ message: 'Password field does not match' });

    }

    if (errors.length > 0) {

        res.render('home-content/register', {

            errors: errors,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email

        });

    }

    else {

        User.findOne({ email: req.body.email }).then(user => {

            if (!user) {

                const newUser = new User({

                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: req.body.password

                });

                bcrypt.genSalt(10, (err, salt) => {

                    bcrypt.hash(newUser.password, salt, (err, hash) => {

                        newUser.password = hash;

                        newUser.save().then(savedUser => {

                            req.flash('success_message', 'Registeration successfully');

                            res.redirect('login');

                        });

                    });
                });

            }

            else {

                req.flash('error_message', 'User email already exists, please login');

                res.redirect('/login');

            }
        });

    }

});





//Services Page

router.get('/services', (req, res) => {

    res.render('home-content/services');
    // i.e., views-> layouts-> home.handlebars to load layout
    //then loads views->home-content->services.handlebar

});




//Contact Page

router.get('/contact', (req, res) => {

    res.render('home-content/contact');
    // i.e., views-> layouts-> home.handlebars to load layout
    //then loads views->homhome-contente->contact.handlebar

});




//Individual Post Page

router.get('/post/:slug', (req, res) => {

    Post.findOne({ slug: req.params.slug }).populate({ path: 'comments', match: { approveComment: true }, populate: { path: 'user', model: 'users' } })

        .populate('user')
        .then(post => {

            Category.find().then(categories => {

                res.render('home-content/individual-post', { post: post, categories: categories });
            });
        });
});



//Router of All
module.exports = router;