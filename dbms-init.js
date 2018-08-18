var mysql = require('mysql');

let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'zoodb'
});

connection.connect(function(err){
  if(err){
    console.error('Error connecting: ' + err.stack);
    return;
  }
  console.log('Connected as ID: ' + connection.threadId);
});

//check if tables exist, and if so drop them
function dropTables(){
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
}

//create/recreate tables
function createTables(){
  let sql1 = "CREATE TABLE animals(id VARCHAR(100), name VARCHAR(100), species VARCHAR(100), type VARCHAR(100), exhibit VARCHAR(100), PRIMARY KEY (id))";
  let sql2 = "CREATE TABLE employees(id VARCHAR(100), name VARCHAR(100), type VARCHAR(100), subtype VARCHAR(100), PRIMARY KEY (id))";
  connection.query(sql1, function(err, result){
    if(err) throw err;
    console.log("Animal table created.");
  });
  connection.query(sql2, function(err, result){
    if(err) throw err;
    console.log("Employee table created.");
  });
}

//populate tables with default data
function populateTables(){
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
      console.log("Record inserted.");
    });
  }
}

dropTables();
createTables();
populateTables();
