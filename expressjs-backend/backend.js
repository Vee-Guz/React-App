const express = require('express');
const app = express();
const port = 5000;

const cors = require('cors');
app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
}); 

const users = { 
    users_list :
    [
       { 
          id : 'xyz789',
          name : 'Charlie',
          job: 'Janitor',
       },
       {
          id : 'abc123', 
          name: 'Mac',
          job: 'Bouncer',
       },
       {
          id : 'ppp222', 
          name: 'Mac',
          job: 'Professor',
       }, 
       {
          id: 'yat999', 
          name: 'Dee',
          job: 'Aspring actress',
       },
       {
          id: 'zap555', 
          name: 'Dennis',
          job: 'Bartender',
       }
    ]
 }

 app.get('/users', (req, res) => {
    const name = req.query.name;
    // implementing job search
    const job = req.query.job;
    if ((job != undefined) && (name != undefined)){
        // filter by name
        let result = findUserByName(name); 
        let name_filter = {users_list: result};
        
        // use filtered name list to filter by job
        result = findUserByJob(job, name_filter); 
        result = {users_list: result};
        res.send(result);
    }
    else if (name != undefined){ // if a name was provided as a query string
        let result = findUserByName(name); 
        // return the user found in a json object
        result = {users_list: result};
        res.send(result);
    }
    else if (job !== undefined) {
        let result = findUserByJob(job, users);
        result = {users_list: result};
        res.send(result);
    } 
    else{
        // if no name provided, return all users
        res.send(users);
    }
});

const findUserByName = (name) => { 
    // gets the "user_list" values from constant user
    // for each json object, check if its name field is the name we are looking for
    // filter will return a list of all users with the name 
    return users['users_list'].filter( (user) => user['name'] === name); 
}

const findUserByJob = (job, name_filter) => {
    return name_filter['users_list'].filter( (user) => user['job'] === job);
}


app.get('/users/:id', (req, res) => { // id is not a query it is a param
    const id = req.params['id']; //or req.params.id
    let result = findUserById(id);
    if (result === undefined || result.length == 0)
        res.status(404).send('Resource not found.');
    else {
        result = {users_list: result};
        res.send(result);
    }
});

function findUserById(id) {
    return users['users_list'].find( (user) => user['id'] === id); // or line below
    //return users['users_list'].filter( (user) => user['id'] === id);
}

app.post('/users', (req, res) => { // post => sends in new information
    const userToAdd = req.body; // getting new data
    userToAdd["id"] = randomIdGenerator();
    addUser(userToAdd);
    res.status(201).send(userToAdd);
});

function randomIdGenerator(){
    const max_Id_size = 5;
    var values = "ABCDEFEHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    var values_num = 62;
    var ID = "";

    for (var i = 0; i < max_Id_size; i++){
        random = Math.floor(Math.random() * values_num); // 62 possible values
        ID += values.charAt(random);
    }

    return ID;
}

function addUser(user){
    users['users_list'].push(user); // adding data to existing 
}

app.delete('/users/:id', (req, res) => {
    const id = req.params.id; // get id from param
    const user_removed = removeById(id);
    if (user_removed){
        res.status(204).end();
    }
    else{
        res.status(404).send('resource not found');
    }
    
});

function removeById(id){
    var user_removed = false;

    // remove user by id
    for (var i = 0; i < users['users_list'].length; i++){
        if (users['users_list'][i]['id'] == id){
            users['users_list'].splice(i, 1);
            user_removed = true;
        }
    }

    return user_removed;
}