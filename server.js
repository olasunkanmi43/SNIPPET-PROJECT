const express = require('express'),
        mongoose = require('mongoose'),
        multer = require('multer'),
        nodemailer = require('nodemailer'),
        app = express();

        const fs = require('fs'),
             path = require('path');
const user = require('./user');

        app.use(express.urlencoded({extended: false}));

        app.set('view engine', 'ejs');

        mongoose.connect("mongodb://localhost:27017/projectDB", { useNewUrlParser: true, useUnifiedTopology: true});

        let storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, 'uploads')
            },
            filename: (req, file, cb) => {
                cb(null, file.fieldname + '-'+ Date.now())
            }
        });

        let upload = multer({storage: storage});

       
        let sender = nodemailer.createTransport({

            service: 'gmail',
            auth: {
                user: 'oceanicdigi@gmail.com',
                pass: ''
            }
        });

        let uModel = require('./user');

        app.get('/', (req, res) => {
            res.render('registration');
        });

        app.post('/', upload.single('image'), (req, res, next) => {
            // console.log(req.body);
            // res.send('Processing');

            const {fn, ln, email, gender, stateOfOrigin} = req.body;

            let mail = {
                from: 'oceanicdigi@gmail.com',
                to: email,
                subject: "Registrattion Successfully",
                text: "Dear " + fn + " " + ln +", thanks for registering. You'll hear from us in a short while",

                attachments: [
                    {
                    filename: 'pic-4.png',
                    path: __dirname + '/pic-4.png',
                    cid: 'uniq-pic-4.png'
                }
                ]            
            };

            
            let user = new uModel({
                fn,ln,email,gender,stateOfOrigin,
                img: {
                    data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
                    contentType: 'image/png'
                }
            });

       

            user.save(function(err) {
                if(err) {
                    console.log(err);
                    req.send("Your data has not been successfully captured");
                } else {
                    res.send("Your data has been successfully captured. Please check your inbox");
                }
            });

            sender.sendMail (mail, function(error, info) {
                if(error) {
                    console.log(error);
                } else {
                    console.log("Email sent successfully: " + info.response);
                }
            });
        });

        app.get('/viewuser', (req, res) => {

            uModel.find(function(err, result) {
                if(err) {
                    console.log(err);
                    res.send("There's a problem");
                } else {
                    res.render('viewuser', {record:result});
                }
            })
        })

        app.get('/viewuser/:uid', (req,res) => {

            // console.log(req.params);
            // res.send("Processing");

            uModel.find({_id: req.params.uid}, (err, record) => {
                    if(err) {
                        console.log(err);
                    }

                    if(record) {
                        res.render('record', {record:record});
                    }
            })
    })


        app.listen(5000, () => {
            console.log("Server listening on port 5000");
        })