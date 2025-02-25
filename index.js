const express = require('express')
const path = require('path')
const cookieParser = require("cookie-parser");
const { connectToMongoDB } = require('./connect')
const { restrictTo, checkForAuthentication } = require("./middewares/url")
const URL = require('./models/url')

const urlRoute = require('./routers/url')
const staticRoute = require('./routers/staticRouter')
const userRoute = require('./routers/user')

const app = express();
const PORT = 8001;

connectToMongoDB('mongodb://localhost:27017/short-url')
.then(() => console.log("MongoDB connected"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthentication);

// app.get('/test', async (req, res) => {
//     const allUrls = await URL.find({});
//     return res.render("home", {
//         urls: allUrls,
//     });
// });

app.use('/url', restrictTo(["NORMAL", "ADMIN"]), urlRoute);
app.use('/user', userRoute);
app.use('/', staticRoute);

app.get('/url/:shortID', async (req, res) => {
    const shortID = req.params.shortID;
    const entry = await URL.findOneAndUpdate({
        shortID
    }, 
    {
        $push: {
            visitHistory: [{
                timeStamp: Date.now(),
            }],
        }
    },
)
res.redirect(entry.redirectUrl)
});

app.listen(PORT, () => console.log(`Server started at port: ${PORT}`));