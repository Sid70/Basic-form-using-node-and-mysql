const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const database = require('./db/dbconn');

//To serve static files such as images, CSS files, and JavaScript files, use the express.
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "Registration_Form.html"));
});

//Then initialize the express to parse JSON data to get the form data, the form data is nested data so we also have to specify the URL encoding as extended true.

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// to set the view engine ( for dynamic content page (ex: ejs , pug , hbs))
app.set('view engine', 'ejs');

//Returns the rendered HTML of a view via the callback function. It accepts an optional parameter that is an object containing local variables for the view. It is like res.render(), except it cannot send the rendered view to the client on its own.

// Registration Form Backend Code Start ***************************************************************************************
app.post('/Registration', (req, res) => {

    const { name, email, phNumber, gender, password } = req.body;

    const query = `SELECT * FROM registration_form WHERE email = '${email}'`;

    database.query(query, (err, row) => {

        if ( err ) throw err;

        if (row.length > 0) {
            res.send('Your email address have already exisit in our database.You can\'t use this email again.');
        }
        else {
            const sql = `INSERT INTO registration_form(name,email,phnumber,gender,password) VALUES ('${name}','${email}','${phNumber}','${gender}','${password}');`;

            database.query(sql, (err) => {
                if (err) {
                    throw err;
                }
                console.log("Data inserted!");
            });

            const send_data = { user_name: name, user_email: email, user_phNumber: phNumber, user_gender: gender, user_password: password };

            //Routing refers to determining how an application responds to a client request to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, and so on).

            res.render(path.join(__dirname, "view", "Registration_Form_fetch.ejs"), send_data);
        }
    });
});

//end ************************************************************************************************************************

// Login Page Backend Code ***************************************************************************************************

app.get('/Login_Form', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "Login_Form.html"));
});

app.post('/Login', (req, res) => {

    const user_login_email = req.body.email;
    const user_login_password = req.body.password;

    let check_email = `SELECT * FROM registration_form WHERE email = '${user_login_email}';`;

    database.query(check_email, (err, row) => {
        if (err) throw err;
        // not find any row 
        if (row.length < 1) {
            res.send('<h2>Your Email Address is not registered on our Website. Please Register yourself.</h2>');
        }
        else if (row.length == 1) {
            check_email = `SELECT * FROM registration_form WHERE email = '${user_login_email}' AND password = '${user_login_password}';`;
            database.query(check_email, (err, row) => {
                if (err) throw err;

                if (row.length < 1) {
                    res.send('You have entered wrong password.');
                }
                else if (row.length == 1) {
                    const send_data = {
                        name: row[0].name,
                        email: row[0].email,
                        phnumber: row[0].phnumber,
                        gender: row[0].gender,
                        password: row[0].password
                    };
                    res.render(path.join(__dirname, "view", "Login_Form_fetch.ejs"), send_data);
                }
            });
        }
    });
});

// end ***********************************************************************************************************************
app.get('/', (req, res) => {
    res.send('Welcome to this site.');
});

// Listin at port:3000

app.listen(port, () => {
    console.log("Connected to the Server at the port:", `${port}`);
})