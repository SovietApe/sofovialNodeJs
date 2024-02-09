var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const schedule = require('node-schedule')
const youtubeVideosRefresh = require('./requests/youtubeRequest');
var cors = require('cors')
//youtubeData
  const apiKey = "AIzaSyDmbBznvlOCe8cI1pCfuZ__llk3hT1UB98"
  const baseApiUrl = "https://www.googleapis.com/youtube/v3"
//ENDyoutubeData
var useVideos = require('./routes/videos')
var usePlaylists = require('./routes/playlists')
var useSearch = require('./routes/search');
var app = express();

app.set("secretKey","dnNode")
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  origin:"*"
}))
app.use('/videos', useVideos)
app.use('/playlists', usePlaylists)
app.use('/search', useSearch)

schedule.scheduleJob('50 * * * *', function(){
  youtubeVideosRefresh()
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
