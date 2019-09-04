var mysql = require('mysql');
var keygen = require('keygenerator');
var fs = require('fs');
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
    if (err){
      console.error('Error connecting: ' + err.stack);
      return;
    }

    console.log('Connected as ID: ' + connection.threadId);
    init();
  });
}

// Create tables only if they don't already exist
// If the table count is not equal to 2, then at least one of the tables does not exist
// So drop both tables if they exist (in case one exists and one doesn't) and recreate them
// If you want to always recreate the tables, just comment out "if (result[0]['COUNT(*)'] === 2) return"
function init() {
  let checkIfTablesExist = `SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'zoodb' AND (table_name = 'animals' OR table_name = 'employees')`;
  connection.query(checkIfTablesExist, (err, result) => {
    if (err) throw err;
    if (result[0]['COUNT(*)'] === 2) return;

    dropTables();
    createTables();
    populateTables();
  })
}

function dropTables() {
  let dropAnimals = "DROP TABLE IF EXISTS animals";
  let dropEmployees = "DROP TABLE IF EXISTS employees";
  connection.query(dropAnimals, function(err, result){
    if(err) throw err;
    console.log("Animal table dropped.");
  });
  connection.query(dropEmployees, function(err, result){
    if(err) throw err;
    console.log("Employee table dropped.");
  });
}

function createTables() {
  let sql3 = "CREATE TABLE animals(id VARCHAR(100), name VARCHAR(100), species VARCHAR(100), type VARCHAR(100), exhibit VARCHAR(100), PRIMARY KEY (id))";
  let sql4 = "CREATE TABLE employees(id VARCHAR(100), name VARCHAR(100), type VARCHAR(100), subtype VARCHAR(100), PRIMARY KEY (id))";
  connection.query(sql3, function(err, result){
    if (err) throw err;
    console.log(result);
  });
  connection.query(sql4, function(err, result){
    if (err) throw err;
    console.log(result);
  });
}

// Load default values from file and put into database
function populateTables() {
  let defaultQueries = [];

  try {
    let animalInputValues = fs.readFileSync('./public/files/db_animal_defaults.txt').toString().split('\n');
    for (let input of animalInputValues) {
      let inputData = input.split(',');
      let insertValues = `'${keygen._()}', '${inputData[0]}', '${inputData[1]}', '${inputData[2]}', '${inputData[3]}'`;
      defaultQueries.push(`INSERT INTO animals (id, name, species, type, exhibit) VALUES (${insertValues})`);
    }
  } catch (err) {
    console.error(err);
  }

  try {
    let employeeInputValues = fs.readFileSync('./public/files/db_employee_defaults.txt').toString().split('\n');
    for (let input of employeeInputValues) {
      let inputData = input.split(',');
      let insertValues = `'${keygen._()}', '${inputData[0]}', '${inputData[1]}', '${inputData[2]}'`;
      defaultQueries.push(`INSERT INTO employees (id, name, type, subtype) VALUES (${insertValues})`);
    }
  } catch (err) {
    console.error(err);
  }

  for (let query of defaultQueries) {
    connection.query(query, (err) => {
      if (err) throw err;
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
