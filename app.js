//Initialisation
var express = require("express");

var fs = require("fs");

var app = express();

var path = require("path");

app.set("port", process.env.PORT || 8080);

var handlebars = require("express-handlebars");
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("travel_bug.db");

var cookieParser = require("cookie-parser");
app.use(cookieParser());

var formidable = require("formidable");

var jimp = require("jimp");

var rmdir = require("rimraf");

var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var session = require("express-session");
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "compsci719"
  })
);

app.use(express.static(__dirname + "/public"));

//Authorisation
getUser = function(username, callback) {
  username = username.toLowerCase();
  db.all("SELECT * FROM user WHERE username = ?", [username], function(
    err,
    rows
  ) {
    if (rows.length > 0) {
      callback(rows[0]);
    } else {
      callback(null);
    }
  });
};

var localStrategy = new LocalStrategy(function(username, password, done) {
  getUser(username, function(user) {
    if (!user) {
      return done(null, false, { message: "Invalid user" });
    }

    if (user.password !== password) {
      return done(null, false, { message: "Invalid password" });
    }

    done(null, user);
  });
});

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
  getUser(username, function(user) {
    done(null, user);
  });
});

passport.use("local", localStrategy);

app.use(passport.initialize());
app.use(passport.session());

//home and login
app.get("/login", function(req, res) {
  if (req.isAuthenticated()) {
    res.redirect("/");
  } else {
    var data = {
      loginFail: req.query.loginFail
    };
    res.render("login", data);
  }
});

app.get("/", function(req, res) {
  if (req.isAuthenticated()) {
    var username = req.user.username;
    var avatar = req.user.avatar;
  }
  db.all(
    "SELECT a.title, a.article_ID, u.avatar, substr(a.content, 1, 200) || '...' as 'articleContent', u.fname || ' ' || u.lname as 'fullName' FROM user u, article a WHERE a.username = u.username",
    function(err, rows) {
      var articles = rows;
      res.render("home", {
        home: true,
        articles: articles,
        avatar: avatar,
        username: username
      });
    }
  );
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login?loginFail=true"
  })
);

//articles (edit/add/view/delete)
app.get("/articles/:article_ID", function(req, res) {
  if (req.isAuthenticated()) {
    var username = req.user.username;
    var avatar = req.user.avatar;
  }
  var articleID = req.params.article_ID;
  db.all(
    "select a.article_ID, a.title, a.content, a.videoAudio, a.username, u.fname || ' ' || u.lname as 'fullName' from article a, user u where a.article_ID = ? and a.username = u.username",
    [articleID],
    function(err, rows) {
      var article = rows[0];
      db.all(
        "select c.comment_ID, c.comment_content, c.username, u.avatar, c.article_ID from comment c, user u where c.username = u.username and c.article_ID = ?",
        [articleID],
        function(err, rows) {
          var comments = rows;
          if (article.username == username) {
            res.render("articleDetails", {
              article_ID: articleID,
              username: username,
              avatar: avatar,
              title: article.title,
              content: article.content,
              videoAudio: article.videoAudio,
              fullName: article.fullName,
              comments: comments,
              authoredArticle: true
            });
          } else {
            res.render("articleDetails", {
              article_ID: articleID,
              username: username,
              avatar: avatar,
              title: article.title,
              content: article.content,
              videoAudio: article.videoAudio,
              fullName: article.fullName,
              comments: comments
            });
          }
        }
      );
    }
  );
});

// Upload file - Added by NCB on 06.11.2017

// Function to copy file between folders

function copyFile(file, dir2) {
  //gets file name and adds it to dir2
  var f = path.basename(file);
  var source = fs.createReadStream(file);
  var dest = fs.createWriteStream(path.resolve(dir2, f));

  source.pipe(dest);
  source.on("end", function() {
    console.log("Succesfully copied");
  });
  source.on("error", function(err) {
    console.log(err);
  });
}

app.get("/addArticle", function(req, res) {
  if (req.isAuthenticated()) {
    var username = req.user.username;
    var avatar = req.user.avatar;
    res.render("addArticle", { username: username, avatar: avatar });
  } else {
    res.redirect("/login");
  }
});

app.post("/addArticle", function(req, res) {
  var username = req.user.username;
  var form = new formidable.IncomingForm();

  form.on("fileBegin", function(name, file) {
    if (file.name) {
      file.path =
        __dirname + "/public/gallery/users/" + username + "/" + file.name;
    }
  });

  form.parse(req, function(err, fields, files) {
    var file = files.videoAudio.name;
    var title = fields.title;
    var content = fields.articleSubmission;
    var videoAudio;
    if (file) {
      videoAudio = file.toLowerCase();
      db.run(
        "INSERT INTO article (title, content, username, videoAudio) VALUES (?, ?, ?, ?)",
        [title, content, req.user.username, videoAudio],
        function(err) {
          res.redirect("/profile");
        }
      );
    } else {
      videoAudio = null;
      db.run(
        "INSERT INTO article (title, content, username, videoAudio) VALUES (?, ?, ?, ?)",
        [title, content, req.user.username, videoAudio],
        function(err) {
          res.redirect("/profile");
        }
      );
    }

    var fileName = file.toLowerCase();

    // Copy uploaded image file to main gallery folder

    var filesrcPath =
      __dirname + "/public/gallery/users/" + username + "/" + fileName;
    var filedestPath = __dirname + "/public/gallery/main/";

    copyFile(filesrcPath, filedestPath);
  });
});

app.get("/edit/:article_ID", function(req, res) {
  if (req.isAuthenticated()) {
    var username = req.user.username;
    var avatar = req.user.avatar;
  }
  var articleID = req.params.article_ID;
  db.all(
    "SELECT title, content, videoAudio FROM article WHERE article_ID = ?",
    [articleID],
    function(err, rows) {
      var loadArticle = rows[0];
      var data = {
        username: username,
        avatar: avatar,
        title: loadArticle.title,
        content: loadArticle.content,
        article_ID: articleID,
        videoAudio: loadArticle.videoAudio,
        edit: true
      };
      res.render("addArticle", data);
    }
  );
});

app.post("/editArticle", function(req, res) {
  var username = req.user.username;
  var form = new formidable.IncomingForm();

  form.on("fileBegin", function(name, file) {
    if (file.name) {
      file.path =
        __dirname + "/public/gallery/users/" + username + "/" + file.name;
    }
  });

  form.parse(req, function(err, fields, files) {
    var file = files.videoAudio.name;
    var title = fields.title;
    var content = fields.articleSubmission;
    var articleID = fields.articleID;
    var videoAudio;
    if (file) {
      videoAudio = file.toLowerCase();
      db.run(
        "UPDATE article SET title = ?, content = ?, username = ?, videoAudio = ? WHERE article_ID = ?",
        [title, content, req.user.username, videoAudio, articleID],
        function(err) {
          res.redirect("/articles/" + articleID);
        }
      );
    } else {
      videoAudio = fields.videoAudio;
      db.run(
        "UPDATE article SET title = ?, content = ?, username = ?, videoAudio = ? WHERE article_ID = ?",
        [title, content, req.user.username, videoAudio, articleID],
        function(err) {
          res.redirect("/articles/" + articleID);
        }
      );
    }
    var fileName = file.toLowerCase();

    // Copy uploaded image file to main gallery folder

    var filesrcPath =
      __dirname + "/public/gallery/users/" + username + "/" + fileName;
    var filedestPath = __dirname + "/public/gallery/main/";

    copyFile(filesrcPath, filedestPath);
  });
});

app.post("/delete/:article_ID", function(req, res) {
  var articleID = req.params.article_ID;
  db.run("DELETE FROM article WHERE article_ID = ?", [articleID], function(
    err
  ) {
    res.redirect("/profile");
  });
});

// Save images directly from TinyMCE
app.post("/saveImages", function(req, res) {
  var username = req.user.username;

  var form = new formidable.IncomingForm();

  form.on("fileBegin", function(name, file) {
    file.path =
      __dirname + "/public/gallery/users/" + username + "/" + file.name;
  });
  form.parse(req, function(err, fields, files) {
    var image = files.file.name;
    var fileName = image.toLowerCase();

    var file = "/gallery/users/" + username + "/" + fileName;
    var filelocation = { location: file };
    res.end(JSON.stringify(filelocation));

    // Copy uploaded image file to main gallery folder

    var filesrcPath =
      __dirname + "/public/gallery/users/" + username + "/" + fileName;
    var filedestPath = __dirname + "/public/gallery/main/";

    copyFile(filesrcPath, filedestPath);
  });
});

//comments (add, delete only if logged in)
app.post("/addComment/:article_ID", function(req, res) {
  var comment_content = req.body.text_comment;
  var articleID = req.params.article_ID;
  var username = req.user.username;
  db.run(
    "INSERT INTO comment (comment_content, article_ID, username) VALUES (?, ?, ?)",
    [comment_content, articleID, username],
    function(err) {
      res.redirect("/articles/" + articleID);
    }
  );
});

app.get("/deleteComment/:article_ID/:comment_ID", function(req, res) {
  var commentID = req.params.comment_ID;
  var articleID = req.params.article_ID;
  var username = req.user.username;
  db.run(
    "DELETE FROM comment WHERE comment_ID = ? AND username = ? AND article_ID = ?",
    [commentID, username, articleID],
    function(err) {
      res.redirect("/articles/" + articleID);
    }
  );
});

app.post("/deleteComment/:article_ID/:comment_ID", function(req, res) {
  var commentID = req.params.comment_ID;
  var articleID = req.params.article_ID;
  db.run("DELETE FROM comment WHERE comment_ID = ?", [commentID], function(
    err
  ) {
    res.redirect("/articles/" + articleID);
  });
});

//signUp and logout
app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

app.get("/form", function(req, res) {
  res.render("form", { title: "Create an account", create: true });
});

//Check if username is available/unavailable
app.get("/createAccount", function(req, res) {
  var username = req.param("username");

  db.all("SELECT username FROM user WHERE username = ?", [username], function(
    err,
    rows
  ) {
    if (err !== null) {
      res.status(500).send("An error has occurred -- " + err);
    } else {
      if (rows.length > 0) {
        res.status(200);
        return res.send("existing_username");
      } else {
        res.status(200);
        return res.send("available_username");
      }
    }
  });
});

app.post("/createAccount", function(req, res) {
  var form = new formidable.IncomingForm();

  form.on("fileBegin", function(name, file) {
    if (file.name) {
      file.path = __dirname + "/public/fullSize/" + file.name;
    }
  });

  form.parse(req, function(err, fields, files) {
    var file = files.fileAvatar.name;
    var username = fields.username;
    username = username.toLowerCase();
    var password = fields.password;
    var fname = fields.fname;
    var lname = fields.lname;
    var DOB = fields.dob;
    var country = fields.country;
    var description = fields.description;
    var avatar;
    var dir = __dirname + "/public/gallery/users/" + username + "/";

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    } else {
    }
    if (file) {
      jimp.read(__dirname + "/public/fullSize/" + file, function(err, image) {
        image.scaleToFit(180, 180);
        image.write(__dirname + "/public/avatar/" + file, function(err) {
          avatar = file;
          db.run(
            "INSERT INTO user (username, password, fname, lname, DOB, country, description, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [
              username,
              password,
              fname,
              lname,
              DOB,
              country,
              description,
              avatar
            ],
            function(err) {
              res.redirect("/login");
            }
          );
        });
      });
    } else if (fields.avatar) {
      avatar = fields.avatar;
      db.run(
        "INSERT INTO user (username, password, fname, lname, DOB, country, description, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [username, password, fname, lname, DOB, country, description, avatar],
        function(err) {
          res.redirect("/login");
        }
      );
    } else {
      avatar = "default.jpg";
      db.run(
        "INSERT INTO user (username, password, fname, lname, DOB, country, description, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [username, password, fname, lname, DOB, country, description, avatar],
        function(err) {
          res.redirect("/login");
        }
      );
    }
  });
});

//profile
app.get("/profile", function(req, res) {
  db.all("SELECT * FROM user WHERE username = ?", [req.user.username], function(
    err,
    rows
  ) {
    var profile = rows[0];
    db.all(
      "SELECT title, substr(content, 1, 300) || '...' as 'content', article_ID FROM article WHERE username = ?",
      [req.user.username],
      function(err, rows) {
        var articles = rows;
        res.render("profile", {
          articles: articles,
          fname: profile.fname,
          lname: profile.lname,
          avatar: profile.avatar,
          username: profile.username,
          dob: profile.DOB,
          description: profile.description,
          country: profile.country
        });
      }
    );
  });
});

app.get("/editAccount", function(req, res) {
  if (req.isAuthenticated()) {
    var username = req.user.username;
    var avatar = req.user.avatar;
  }
  var data = {
    fname: req.user.fname,
    lname: req.user.lname,
    DOB: req.user.DOB,
    country: req.user.country,
    description: req.user.description,
    edit: true,
    username: username,
    avatar: avatar
  };
  res.render("form", data);
});

app.post("/editAccount", function(req, res) {
  var form = new formidable.IncomingForm();

  form.on("fileBegin", function(name, file) {
    if (file.name) {
      file.path = __dirname + "/public/fullSize/" + file.name;
    }
  });

  form.parse(req, function(err, fields, files) {
    var file = files.fileAvatar.name;
    var username = fields.username;
    var password = fields.password;
    var fname = fields.fname;
    var lname = fields.lname;
    var DOB = fields.dob;
    var country = fields.country;
    var description = fields.description;
    var avatar;

    if (file) {
      jimp.read(__dirname + "/public/fullSize/" + file, function(err, image) {
        image.scaleToFit(180, 180);
        image.write(__dirname + "/public/avatar/" + file, function(err) {
          avatar = file;
          db.run(
            "UPDATE user SET fname = ?, lname = ?, DOB = ?, country = ?, description = ?, avatar = ? WHERE username = ?",
            [
              fname,
              lname,
              DOB,
              country,
              description,
              avatar,
              req.user.username
            ],
            function(err) {
              res.redirect("/profile");
            }
          );
        });
      });
    } else {
      avatar = fields.avatar;
      db.run(
        "UPDATE user SET fname = ?, lname = ?, DOB = ?, country = ?, description = ?, avatar = ? WHERE username = ?",
        [fname, lname, DOB, country, description, avatar, req.user.username],
        function(err) {
          res.redirect("/profile");
        }
      );
    }
  });
});

// Function to delete files -- Added by NCB on 09.11.2017
function deleteFile(req, res) {
  if (req.isAuthenticated()) {
    var username = req.user.username;
  } else {
    var username = null;
  }

  fs.readdir(__dirname + "/public/gallery/users/" + username + "/", function(
    err,
    files
  ) {
    for (var i = 0; i < files.length; i++) {
      var file = files[i].toLowerCase();

      fs.unlink(__dirname + "/public/gallery/main/" + file, function(error) {
        if (error) {
          return console.log(error);
        }
        console.log("File deleted successfully from main folder");
      });
    }

    rmdir(__dirname + "/public/gallery/users/" + username + "/", function(
      error
    ) {
      console.log("done");
    });
  });
}

app.get("/deleteAccount", function(req, res) {
  // Delete files -- Added by NCB on 09.11.2017
  deleteFile(req, res);

  var username = req.user.username;
  db.run("DELETE FROM article WHERE username = ?", [username], function(err) {
    db.run("DELETE FROM comment WHERE username = ?", [username], function(err) {
      db.run("DELETE FROM user WHERE username = ?", [username], function(err) {
        res.redirect("/");
      });
    });
  });
});

//Multimedia gallery
// Function to populate browse-gallery view
function multimediaGallery(req, res, filePath) {
  if (req.isAuthenticated()) {
    var username = req.user.username;
    var avatar = req.user.avatar;
  } else {
    var username = null;
  }

  fs.readdir(__dirname + "/public" + filePath, function(err, files) {
    var imgGallery = [];
    var videoGallery = [];
    var audioGallery = [];

    for (var i = 0; i < files.length; i++) {
      var file = files[i].toLowerCase();
      if (
        file.endsWith(".png") ||
        file.endsWith(".bmp") ||
        file.endsWith(".jpg") ||
        file.endsWith(".jpeg")
      ) {
        imgGallery[imgGallery.length] = filePath + file;
      }

      if (
        file.endsWith(".mp4") ||
        file.endsWith(".ogg") ||
        file.endsWith(".webm")
      ) {
        videoGallery[videoGallery.length] = filePath + file;
      }

      if (file.endsWith(".mp3")) {
        audioGallery[audioGallery.length] = filePath + file;
      }
    }

    var data = {
      allGallery: true,
      userGallery: true,
      filePath: filePath,
      username: username,
      avatar: avatar,
      imggalleryTitle: "Photo Gallery",
      imgGallery: imgGallery,
      videogalleryTitle: "Video Gallery",
      videoGallery: videoGallery,
      audiogalleryTitle: "Music Gallery",
      audioGallery: audioGallery
    };
    res.render("browse-gallery", data);
  });
}

//---------------------------------------------------------------------------------------
app.get("/browse-gallery/selection", function(req, res) {
  var filePath = null;
  var username = req.user.username;
  var galleryType = req.query.type;

  if (galleryType === "usergallery") {
    filePath = "/gallery/users/" + username + "/";
  }

  if (galleryType === "allgallery") {
    filePath = "/gallery/main/";
  }

  multimediaGallery(req, res, filePath);
});

app.get("/browse-gallery", function(req, res) {
  var filePath = null;
  if (req.isAuthenticated()) {
    var username = req.user.username;
    var avatar = req.user.avatar;
    filePath = "/gallery/users/" + username + "/";
  } else {
    var username = null;
    filePath = "/gallery/main/";
  }

  multimediaGallery(req, res, filePath);
});

//Miscellaneous
app.get("/terms", function(req, res) {
  res.render("terms");
});

app.get("/privacy", function(req, res) {
  res.render("privacy");
});

//Run the whole thing on port 3000
app.listen(app.get("port"), function() {
  console.log("Express started on http://localhost:" + app.get("port"));
});
