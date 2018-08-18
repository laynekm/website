/*

All of these functions:
1. Read data from input fields
2. Create an object of this data
3. Send this object to the server
4. Handle the server response

*/

function addAnimal(){
  let animal_name = document.getElementById('animal_name').value;
  let animal_species = document.getElementById('animal_species').value;
  let animal_type = document.getElementById('animal_type').value;
  let animal_exhibit = document.getElementById('animal_exhibit').value;

  let animalObj = {
    name: animal_name,
    species: animal_species,
    type: animal_type,
    exhibit: animal_exhibit
  };

  $.post('/addAnimal', animalObj, function(data, status){
    alert(data);
    location.reload();
  });
}

function addEmployee(){
  let employee_name = document.getElementById('employee_name').value;
  let employee_type = document.getElementById('employee_type').value;

  //only use the subtype that has been selected (ie. the value is not the defautl 'Choose...')
  let employee_subtype;
  if(document.getElementById('employee_handler_exhibit').value != 'Choose...'){
    employee_subtype = document.getElementById('employee_handler_exhibit').value;
  }
  else if(document.getElementById('employee_maintenance_job').value != 'Choose...'){
    employee_subtype = document.getElementById('employee_maintenance_job').value;
  }
  else{
    employee_subtype = document.getElementById('employee_admin_dept').value;
  }

  let employeeObj = {
    name: employee_name,
    type: employee_type,
    subtype: employee_subtype
  };

  $.post('/addEmployee', employeeObj, function(data, status){
    alert(data);
    location.reload();
  });
}

function queryAnimal(){
  let animal_id = document.getElementById('animal_id').value;
  let animal_name = document.getElementById('animal_name').value;
  let animal_species = document.getElementById('animal_species').value;

  //only use the type/exhibit that have been selected (ie. not the default 'Choose...')
  let animal_type = '';
  let animal_exhibit = '';
  if(document.getElementById('animal_type').value != 'Choose...'){
    animal_type = document.getElementById('animal_type').value;
  }
  if(document.getElementById('animal_exhibit').value != 'Choose...'){
    animal_exhibit = document.getElementById('animal_exhibit').value;
  }

  let animalObj = {
    id: animal_id,
    name: animal_name,
    species: animal_species,
    type: animal_type,
    exhibit: animal_exhibit
  };

  $.post('/queryAnimal', animalObj, function(data, status){
    $('#table').bootstrapTable('destroy');
    $('#table-header').text(data.length + " results");
    $('#table-header').show();
    $('#table').show();
    $('#table').bootstrapTable({
        data: data
    });
  });
}

function queryEmployee(){
  let employee_id = document.getElementById('employee_id').value;
  let employee_name = document.getElementById('employee_name').value;

  //only use the type/subtype that have been selected (ie. not the defautl 'Choose...')
  let employee_type = '';
  let employee_subtype = '';
  if(document.getElementById('employee_type').value != 'Choose...'){
    employee_type = document.getElementById('employee_type').value;
  }
  if(document.getElementById('employee_handler_exhibit').value != 'Choose...'){
    employee_subtype = document.getElementById('employee_handler_exhibit').value;
  }
  else if(document.getElementById('employee_maintenance_job').value != 'Choose...'){
    employee_subtype = document.getElementById('employee_maintenance_job').value;
  }
  else if(document.getElementById('employee_admin_dept').value != 'Choose...'){
    employee_subtype = document.getElementById('employee_admin_dept').value;
  }

  let employeeObj = {
    id: employee_id,
    name: employee_name,
    type: employee_type,
    subtype: employee_subtype
  }

  $.post('/queryEmployee', employeeObj, function(data, status){
    $('#table').bootstrapTable('destroy');
    $('#table-header').text(data.length + " results");
    $('#table-header').show();
    $('#table').show();
    $('#table').bootstrapTable({
        data: data
    });
  });

}

//get all animals from database, display using default bootstrap table
function getAllAnimals(){
  $.get('/getAllAnimals', function(data, status){
    $('#table').bootstrapTable('destroy');
    $('#table-header').text(data.length + " results");
    $('#table-header').show();
    $('#table').show();
    $('#table').bootstrapTable({
        data: data
    });
  });
}

//get all employees from database, display using default bootstrap table
function getAllEmployees(){
  $.get('/getAllEmployees', function(data, status){
    $('#table').bootstrapTable('destroy');
    $('#table-header').text(data.length + " results");
    $('#table-header').show();
    $('#table').show();
    $('#table').bootstrapTable({
        data: data
    });
  });
}

//send animal ID to server to be removed
function removeAnimalByID(){
  let animal_id = document.getElementById('animal_id').value;
  let animalObj = {id: animal_id};

  $.post('/removeAnimal', animalObj, function(data, status){
    alert(data);
    location.reload();
  });
}

//send animal name to server to be removed
function removeAnimalByName(){
  let animal_name = document.getElementById('animal_name').value;
  let animalObj = {name: animal_name};

  $.post('/removeAnimal', animalObj, function(data, status){
    alert(data);
    location.reload();
  });
}

//send employee ID to server to be removed
function removeEmployeeByID(){
  let employee_id = document.getElementById('employee_id').value;
  let employeeObj = {id: employee_id};

  $.post('/removeEmployee', employeeObj, function(data, status){
    alert(data);
    location.reload();
  });
}

//send employee name to server to be removed
function removeEmployeeByName(){
  let employee_name = document.getElementById('employee_name').value;
  let employeeObj = {name: employee_name};

  $.post('/removeEmployee', employeeObj, function(data, status){
    alert(data);
    location.reload();
  });
}
