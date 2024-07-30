const express = require("express");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors(corsOptions));
const bodyParser = require('body-parser')
mongoose.set('strictQuery', false);
var corsOptions = {
  origin: ['http://localhost:8081','http://localhost:3000', 'http://localhost:3001','http://127.0.0.1:5173','http://127.0.0.1:5174']
};


const MONGODB_URI = process.env.MONGODB_URI;


const productRoutes=require ('./app/routes/product.routes')


const uploadRoute = require('./app/routes/upload.route'); 
const downloadRoutes = require('./app/routes/download.routes');

const cartaRoutes = require ('./app/routes/carta.routes')

app.use('/download', downloadRoutes);
app.use('/upload', uploadRoute); 
app.use('/product',productRoutes)


app.use('/carta',cartaRoutes)

app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;

db.mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
   
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to habib application." });
});





app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}
