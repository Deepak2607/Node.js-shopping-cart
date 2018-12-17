var express = require('express');
var router = express.Router();
const bcrypt= require('bcryptjs');
const {Product}= require('../models/product');
const {User}= require('../models/user');
const Cart= require('../models/cart');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

router.all('/*',(req,res,next)=> {
    req.app.locals.layout= 'layout';
    next();
})

const isLoggedout= (req,res,next)=> {
    if(! req.isAuthenticated()){
        next();
    }else{
        req.flash('error_message',`You need to logout first.`);
        res.redirect('/');
    }
}

const isLoggedin= (req,res,next)=> {
    if(req.isAuthenticated()){
        
        next();    
    }else{
//        req.flash('error_message',`You need to logout first.`);
        res.redirect('/');
    }
}


router.get('/signup',isLoggedout,(req,res,next)=> {
 
    res.render('routes_UI/signup');
})


router.get('/login',isLoggedout,(req,res,next)=> {
 
    res.render('routes_UI/login');
})


router.get('/profile',isLoggedin,(req,res,next)=> {
 
    res.render('routes_UI/profile',{user:req.user});
})

    

router.get('/add-to-cart/:id',isLoggedin,(req,res,next)=> {

    let cart= new Cart(req.session.cart ? req.session.cart : {} );
    
    Product.findById(req.params.id).then((product)=> {
        
        cart.add(product, product.id);
        cart.generateArray();
        req.session.cart= cart;
        res.redirect('/');
    }); 
});

router.get('/cart',isLoggedin,(req,res)=> {
    
    let cart= req.session.cart || {};
    let itemsArray= cart.itemsArray ||[];
//    console.log(itemsArray);
    res.render('routes_UI/cart',{cart, itemsArray, user:req.user});

})



router.post('/signup',(req,res)=> {
    
    
    if(req.body.password!==req.body.confirmPassword){
        req.flash('error_message',`Passwords do not match`);
        res.redirect('/signup');
    }else{
        
        User.findOne({ email: req.body.email}).then((user)=> {
            if(user){
               req.flash('error_message',`A user with this email already exists`);
               res.redirect('/signup');
            }else{
                    bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(req.body.password, salt, function(err, hash) {

                        const user= new User({
                                username:req.body.username,
                                email:req.body.email,
                                password:hash
                            });

                        user.save().then(()=> {
                            req.flash('success_message',`You have registered successfully, please login`);
                            res.redirect('/login');
                        });
                     });
                  });
            }
        })   
    }   
})


passport.use(new LocalStrategy({usernameField: 'email'},
  (email, password, done)=> {
    
    User.findOne({email:email}).then((user)=> {
        
      if (!user) {
        return done(null, false);
      }
        
        bcrypt.compare(password, user.password,(err, matched)=> {
            
                if(matched){
                    return done(null, user);
                }
                else{
                    return done(null, false);
                }
        });
    })
   }
));


passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});



router.post('/login',
  passport.authenticate('local'
                        , {successRedirect: '/',
                          failureRedirect: '/login',
                          failureFlash: 'Invalid email or password.',
                          successFlash: 'You are logged in, now you can buy products.'}
                       ));



router.get('/logout',(req, res)=>{

//  req.session.destroy();
  req.logout();
  res.redirect('/login');
});

                           

router.get('/',(req, res)=> {
    
    Product.find().then((products)=> {
        
        let productChunks=[];
        const chunkSize= 4;
        for(let i=0; i<products.length; i +=chunkSize){
            productChunks.push(products.slice(i, i+chunkSize));
        }
        
        res.render('routes_UI/index', {productChunks, user:req.user});
    })
});



const products= [
    new Product({
        imagePath: 'https://images-na.ssl-images-amazon.com/images/I/71cTCvSFJTL._SY500_.jpg',
        title: 'PUBG',
        description: 'Nice game',
        price: 10
    }),
    new Product({
        imagePath: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2z6Omrw3Ieo38UQF_uhDwL8HP70pHXHgblqIEGUUIH41_yMrq',
        title: 'Fortnite',
        description: 'Nice game',
        price: 10
    }),
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a5/Grand_Theft_Auto_V.png/220px-Grand_Theft_Auto_V.png',
        title: 'GTA V',
        description: 'Nice game',
        price: 10
    }),
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c8/Blur_%28video_game%29.jpg/220px-Blur_%28video_game%29.jpg',
        title: 'Blur',
        description: 'Nice game',
        price: 10
    }),
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8b/God_of_War_III_cover_art.jpg/220px-God_of_War_III_cover_art.jpg',
        title: 'God of Wars',
        description: 'Nice game',
        price: 10
    }),
    new Product({
         imagePath:
        'https://upload.wikimedia.org/wikipedia/en/thumb/5/5f/Call_of_Duty_4_Modern_Warfare.jpg/220px-Call_of_Duty_4_Modern_Warfare.jpg',
        title: 'Call of Duty',
        description: 'Nice game',
        price: 10
    })
]

for(let i=0; i < products.length; i++){
    
    Product.find().then((productss)=> {
        let count= 0;
        for(let j=0; j< productss.length; j++){
            if(products[i].title===productss[j].title){
               count++;
            }
        }
        if(count==0){
            products[i].save();
        }
    })
    
}


module.exports = router;
