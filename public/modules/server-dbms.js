var mysql = require('mysql');
var keygen = require('keygenerator');
var connection;

// Connect to database
exports.connect = function() {
  connection = mysql.createConnection({
    host:     process.env.RDS_HOSTNAME,
    user:     process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port:     process.env.RDS_PORT,
    database: process.env.RDS_DB_NAME
  });

  connection.connect(function(err){
    if(err){
      console.error('Error connecting: ' + err.stack);
      return;
    }
    console.log('Connected as ID: ' + connection.threadId);
    init();
  });
}

// Initialize database components
let init = function(){
  // Drop existing tables, if they exist
  let sql1 = "DROP TABLE IF EXISTS animals";
  let sql2 = "DROP TABLE IF EXISTS employees";
  connection.query(sql1, function(err, result){
    if(err) throw err;
    console.log("Animal table dropped.");
  });
  connection.query(sql2, function(err, result){
    if(err) throw err;
    console.log("Employee table dropped.");
  });

  // Create tables
  let sql3 = "CREATE TABLE animals(id VARCHAR(100), name VARCHAR(100), species VARCHAR(100), type VARCHAR(100), exhibit VARCHAR(100), PRIMARY KEY (id))";
  let sql4 = "CREATE TABLE employees(id VARCHAR(100), name VARCHAR(100), type VARCHAR(100), subtype VARCHAR(100), PRIMARY KEY (id))";
  connection.query(sql3, function(err, result){
    if(err) throw err;
    console.log("Animal table created.");
  });
  connection.query(sql4, function(err, result){
    if(err) throw err;
    console.log("Employee table created.");
  });

  // Populate default data
  let sql = [];
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('kl5lgleIjCkoPUOI4qL4qAAFNGJlpWa1', 'Turkish', 'Polar Bear', 'Mammal', 'Arctic')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('C4q8qUZJPpjZsylJWEnZ6llDLKlAcJbq', 'Tommy', 'Polar Bear', 'Mammal', 'Arctic')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('vv7h7y4WESiDIvEEkMWzxsPlRNsB4kcU', 'Mickey', 'Walrus', 'Mammal', 'Arctic')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('CW7VUz13cQyrzlAYOa86lz8ctgvpPRzU', 'Franky', 'Penguin', 'Bird', 'Arctic')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('kVdIqIasSw8YJh3jfMRXFmE0e8AHekwk', 'Vinny', 'Penguin', 'Bird', 'Arctic')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('sATmyy0TM1TQ8Qjo5ock5pl4TqEiQml2', 'Gustave', 'Iguana', 'Reptile', 'Savannah')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('rqWhxs5DxlzP3KVvcFj3JZlMF2Is711B', 'Zero', 'Salamander', 'Reptile', 'Savannah')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('E9vikAZwlqxE8mvp4VxlRbCxxvf82fbj', 'Dmitri', 'Elephant', 'Mammal', 'Savannah')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('bdmowChKcEBZMzxodWqoBungj1O7LdAI', 'Mr. Moustafa', 'Lion', 'Mammal', 'Savannah')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('JQFSc82xYWjopbzlaeHbry1cjulyl3xf', 'Agatha', 'Flamingo', 'Bird', 'Savannah')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('6TSnRMw3XmzRl8FEGGb48YQJ62BGhX9o', 'Raoul Duke', 'Raccoon', 'Mammal', 'Temperate')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('DkspRBQAHrp4GRvv3qEqNWP3gg5de5vz', 'Dr. Gonzo', 'Grizzly Bear', 'Mammal', 'Temperate')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('aq38JbXidugROdYvO6NzNnfakzW6v6rx', 'Vincent', 'Blue-Eyed Hawk', 'Bird', 'Temperate')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('LHhlSI2T2ZfOXgb8jJVlsgbrdG4lTuZd', 'Jules', 'Rare Hopping Frog', 'Amphibian', 'Temperate')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('f7etZai4KCqRdrBUxo0crf2EJFWjgoqU', 'Marsellus', 'Slippery Toad', 'Amphibian', 'Temperate')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('ccFAatIzdlZbfgc1BN3r823Edi0MA5xM', 'Aldo', 'Walrus', 'Mammal', 'Marine')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('Uxk2flMTtbueCQqKpho9DWNXLkaxS4Nc', 'Hans', 'Orca', 'Mammal', 'Marine')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('5FUJaK4twNv9kADjvY5k9HcsabDM4WQG', 'Shosanna', 'Rainbow Fish', 'Fish', 'Marine')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('j9mBou9Ygm4rocIRgDjCE1hUpd7PPdin', 'Donny', 'Clown Fish', 'Fish', 'Marine')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('RfHxYa3jDcU1U3DUTnKX6f4o6YutDgnt', 'Hugo', 'Winged Cossack', 'Fish', 'Marine')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('2Cip2axsmZwbzcy088stsUHDUKlxuDhe', 'Grant', 'Tyrannosaurus Rex', 'Reptile', 'Jurassic')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('bMm1VtZc1Z4SeqEyFs6grxoHpUo50UV0', 'Malcolm', 'Velociraptor', 'Reptile', 'Jurassic')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('MWXcP6NVGRQFA5DZZYj5g3xa9Ru9oxs7', 'Hammond', 'Brachiosaurus', 'Reptile', 'Jurassic')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('cmDuhOqevB2riOhw2DWoO2izVR47oMtN', 'Muldoon', 'Triceratops', 'Reptile', 'Jurassic')");
  sql.push("INSERT INTO animals (id, name, species, type, exhibit) VALUES ('cQYPYJVVP52Ekyurup2wMwh2NUzXIFGJ', 'Arnold', 'Stegosaurus', 'Reptile', 'Jurassic')");

  sql.push("INSERT INTO employees (id, name, type, subtype) VALUES ('edYZqwCWuR7yJFnMAFKXuF4o0nml7BZd', 'Emre Hamer', 'Handler', 'Arctic')");
  sql.push("INSERT INTO employees (id, name, type, subtype) VALUES ('Fa18jiYuEEvlF0lcMZsaMn0KCT2IHsI4', 'Leighton Parkinson', 'Handler', 'Savannah')");
  sql.push("INSERT INTO employees (id, name, type, subtype) VALUES ('eOwYh73qKJ37RgARPpKCQIomQhcGdu8S', 'Komal William', 'Handler', 'Temperate')");
  sql.push("INSERT INTO employees (id, name, type, subtype) VALUES ('O98g44rZY6ATmFLTjV8VMp2LjN6CYg3Y', 'Brody Ellison', 'Handler', 'Marine')");
  sql.push("INSERT INTO employees (id, name, type, subtype) VALUES ('MM1sC69zC6pgBpNEgAXiVZRJ0P5zQ2D1', 'Paula Lin', 'Handler', 'Jurassic')");
  sql.push("INSERT INTO employees (id, name, type, subtype) VALUES ('G7zYO9eTZx3V37qcQCFDwi1RsVQRKBfm', 'Harylee Peel', 'Maintenance', 'Cleaning')");
  sql.push("INSERT INTO employees (id, name, type, subtype) VALUES ('4bV8tgVKc5BXXQIv3xjYg1VGRg3nCtmE', 'Byron Whyte', 'Maintenance', 'Plumbing')");
  sql.push("INSERT INTO employees (id, name, type, subtype) VALUES ('010fc6K314XAIs4i1319t3ClPyRaYz3y', 'Cherish Fritz', 'Maintenance', 'Electric')");
  sql.push("INSERT INTO employees (id, name, type, subtype) VALUES ('hHb7hTEqT8zToWefniZ2GFop9fNIM2mV', 'Aleeza Hayden', 'Maintenance', 'Shipping')");
  sql.push("INSERT INTO employees (id, name, type, subtype) VALUES ('l0EiD69ASBeQ55EBrJiB4srKqPazYF80', 'Clay Haigh', 'Maintenance', 'Receiving')");
  sql.push("INSERT INTO employees (id, name, type, subtype) VALUES ('6AAcdGYyJDy8gZbCSKgHWbVFRLcpkHqb', 'Kavita Weston', 'Administrator', 'Office Administration')");
  sql.push("INSERT INTO employees (id, name, type, subtype) VALUES ('1BLAV9hYIoxRiR8EvDLvExNbyU9hqdyP', 'Ismael Oconnor', 'Administrator', 'Field Administration')");
  sql.push("INSERT INTO employees (id, name, type, subtype) VALUES ('NH05uu32L58eeNbm4fgj1onkFiDPHLAQ', 'Raymond Lang', 'Administrator', 'Public Relations')");
  sql.push("INSERT INTO employees (id, name, type, subtype) VALUES ('HTY4nFrBW3oZhPiEJrGr0LYLldiHtJpr', 'Daria Shea', 'Administrator', 'Human Resources')");
  sql.push("INSERT INTO employees (id, name, type, subtype) VALUES ('MYBmqa7ewq1KqsBXMnevQbEj1eaXPglw', 'Ayda Winter', 'Administrator', 'IT')");

  for(let i in sql){
    connection.query(sql[i], function(err, result){
      if(err) throw err;
    });
  }
}

// Add animal to database, return to client the ID that was generated
exports.addAnimal = function(req, res){
  let id = keygen._();
  let name = req.body.name;
  let species = req.body.species;
  let type = req.body.type;
  let exhibit = req.body.exhibit;

  let sql = "INSERT INTO animals (id, name, species, type, exhibit) VALUES ('" + id + "', '" + name + "', '" + species + "', '" + type + "', '" + exhibit + "')";
  connection.query(sql, function(err, result){
    if(err){
      res.send(err.toString());
    }
    else{
      res.send('Record added to database. \n ID: ' + id);
    }
  });
}

// Query animals, return results to client
exports.queryAnimal = function(req, res) {
  let id, name, species, type, exhibit;
  if(req.body.id){ id = req.body.id; }
  if(req.body.name){ name = req.body.name; }
  if(req.body.species){ species = req.body.species; }
  if(req.body.type){ type = req.body.type; }
  if(req.body.exhibit){ exhibit = req.body.exhibit; }

  let sql = "SELECT * FROM animals WHERE ";
  if(id){       sql += "id = '" + id + "' AND "; }
  if(name){     sql += "name = '" + name + "' AND "; }
  if(species){  sql += "species = '" + species + "' AND "; }
  if(type){     sql += "type = '" + type + "' AND "; }
  if(exhibit){  sql += "exhibit = '" + exhibit + "'"; }

  // Remove 'AND ' at the end
  if(sql.substring(sql.length - 4, sql.length) == 'AND '){
    sql = sql.substring(0, sql.length - 5);
  }

  connection.query(sql, function(err, result){
    if(err){
      res.send(err.toString());
    }
    else{
      res.send(result);
    }
  });
}

// Returns all animals
exports.getAllAnimals = function(req, res){
  let sql = "SELECT * FROM animals";
  connection.query(sql, function(err, result){
    if(err){
      res.send(err.toString());
    }
    else{
      res.send(result);
    }
  });
}

// Remove animal from database, returns success or failure
exports.removeAnimal = function(req, res){
  let id, name;
  if(req.body.id){ id = req.body.id; }
  if(req.body.name){ name = req.body.name; }

  let sql;
  if(id) {sql = "DELETE FROM animals WHERE id = '" + id + "'"; }
  else if(name) { sql = "DELETE FROM animals WHERE name = '" + name + "'"; }

  connection.query(sql, function(err, result){
    if(err){
      res.send(err.toString());
    }
    else if(result.affectedRows < 1){
      res.send('Could not find record in database.');
    }
    else{
      res.send('Successfully removed record from database.');
    }
  });
}

// Add employee to database, return to client the ID that was generated
exports.addEmployee = function(req, res){
  let id = keygen._();
  let name = req.body.name;
  let type = req.body.type;
  let subtype = req.body.subtype;

  let sql = "INSERT INTO employees (id, name, type, subtype) VALUES ('" + id + "', '" + name + "', '" + type + "', '" + subtype + "')";
  connection.query(sql, function(err, result){
    if(err){
      res.send(err.toString());
    }
    else{
      res.send('Record added to database. \n ID: ' + id);
    }
  });
}

// Query employees, return results to client
exports.queryEmployee = function(req, res){
  let id, name, type, subtype;
  if(req.body.id){ id = req.body.id; }
  if(req.body.name){ name = req.body.name; }
  if(req.body.type){ type = req.body.type; }
  if(req.body.subtype){ subtype = req.body.subtype; }

  let sql = "SELECT * FROM employees WHERE ";
  if(id){       sql += "id = '" + id + "' AND "; }
  if(name){     sql += "name = '" + name + "' AND "; }
  if(type){     sql += "type = '" + type + "' AND "; }
  if(subtype){  sql += "subtype = '" + subtype + "'"; }

  // Remove 'AND ' at the end
  if(sql.substring(sql.length - 4, sql.length) == 'AND '){
    sql = sql.substring(0, sql.length - 5);
  }

  connection.query(sql, function(err, result){
    if(err){
      res.send(err.toString());
    }
    else{
      res.send(result);
    }
  });
}

// Returns all employees
exports.getAllEmployees = function(req, res){
  let sql = "SELECT * FROM employees";
  connection.query(sql, function(err, result){
    if(err){
      res.send(err.toString());
    }
    else{
      res.send(result);
    }
  });
}

// Remove employee from database, returns success or failure
exports.removeEmployee = function(req, res){
  let id, name;
  if(req.body.id){ id = req.body.id; }
  if(req.body.name){ name = req.body.name; }

  let sql;
  if(id){ sql = "DELETE FROM employees WHERE id = '" + id + "'"; }
  else if(name){ sql = "DELETE FROM employees WHERE name = '" + name + "'"; }

  connection.query(sql, function(err, result){
    if(err){
      res.send(err.toString());
    }
    else if(result.affectedRows < 1){
      res.send('Could not find record in database.');
    }
    else{
      res.send('Successfully removed record from database.');
    }
  });
}
