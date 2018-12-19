const express= require('express');
const mongoose= require('mongoose');
const upload= require('express-fileupload');
const bodyParser= require('body-parser');
const exphbs= require('express-handlebars');
const path= require('path');
const methodOverride= require('method-override');
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session= require('express-session');
const flash= require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const MongoStore = require('connect-mongo')(session);

const app= express();
const port= process.env.PORT || 8000;
app.use(express.static(path.join(__dirname, 'public')));


//database-connection
//mongoose.Promise= global.Promise;
//process.env.MONGODB_URI ||
mongoose.connect(process.env.MONGODB_URI ||'mongodb://localhost:27017/shopping-cart',{ useNewUrlParser: true });


//upload-middleware
app.use(upload());                              


//body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


//View engine-----defaultLayout:home
app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');


//method-override
app.use(methodOverride('_method'));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


//session-middleware
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'deepakkumrawat8@gmail.com',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection: mongoose.connection}), 
  cookie: {maxAge: 720 * 60 * 1000}
}))


//flash-middleware
app.use(flash());


//below is a way to send some data from controllers(backend) to views(frontend).
//the data(which is passed) can be accessed in all the views.

//another way is- by passing the data as the second argument in res.render('/',{data});
//data can be accessed in that view only to which data is sent.

app.use((req,res,next)=> {
    res.locals.user= req.user || null;
    res.locals.success_message=req.flash('success_message');
    res.locals.error_message=req.flash('error_message');
    res.locals.error=req.flash('error');
    res.locals.success=req.flash('success');
    
    res.locals.login=req.isAuthenticated();
    res.locals.session=req.session;
    next();
});


app.use(passport.initialize());
app.use(passport.session());


//Load Routes
 var indexRouter = require('./routes/index');


//Use routes
app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});



app.listen(port,()=> {
    console.log(`Started on port ${port}`);
})
