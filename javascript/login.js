

firebase.auth().onAuthStateChanged(function (user) {

  if (user) {
    // User is signed in.
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: "Login realizado com sucesso",
      showConfirmButton: false,
      timer: 2000
    });
    readTask();

    document.getElementById("user-div").style.display = "block";
    document.getElementById("login-div").style.display = "none";


  } else {

    resetarLogout();

    document.getElementById("user-div").style.display = "none";
    document.getElementById("login-div").style.display = "block";


    // User is signed out.
    // ...
  }
});


function login() {
  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    Swal.fire({
      position: 'center',
      icon: 'error',
      title: "Erro ao realizar login",
      showConfirmButton: false,
      timer: 2000
    });
    readTask();
    // ...
  });

}

function logout() {
  firebase.auth().signOut().then(function () {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: "Logout realizado com sucesso",
      showConfirmButton: false,
      timer: 2000
    });
  }).catch(function (error) {

  });
}

// Começo da segunda parte javascript

// Objeto do tipo date 
var d = new Date();
var t = d.getTime();
var counter = t;
// usando para calcular a hora e data

// Criando um listening para pegar os dados dos campos descrição e tarefa
document.getElementById("form").addEventListener("submit", (e) => {

  var task = document.getElementById("task").value;
  var description = document.getElementById("description").value;
  e.preventDefault();

  // Função para criar uma nova tarefa
  createTask(task, description);

  form.reset();

});

function createTask(taskName, taskDescription) {
  console.log(counter);
  counter += 1;
  console.log(counter);
  var task = {
    id: counter,
    task: taskName,
    description: taskDescription
  }

  let db = firebase.database().ref("tasks/" + counter);
  db.set(task);
  document.getElementById("cardSection").innerHTML = '';
  readTask();

  //usando a apai sweet alert
  Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'Tarefa adicionada com sucesso',
    showConfirmButton: false,
    timer: 2000
  })

}

// Função usada para carregar as tarefas
function readTask() {

  var task = firebase.database().ref("tasks/");
  task.on("child_added", function (data) {
    var taskValue = data.val();

    document.getElementById("cardSection").innerHTML += `
        
      <div class=" card mb-3 bg-dark text-white border border-white"> 
      <div class="card-body"> 
      <h5 class="card-title"> Tarefa: ${taskValue.task} </h5> 
      <p class="card-text"> Descrição: ${taskValue.description} </p>
      <button type="submit" style="color: white" class="btn btn-warning" 
      onclick="updateTask(${taskValue.id}, '${taskValue.task}', '${
      taskValue.description}')"><i class="fas fa-edit"></i> Editar Tarefa
        </button> 
        <button type="submit" style="color:white" class="btn btn-danger" 
        onclick="deleteTask(${taskValue.id})"><i class="fas fa-trash-alt"></i>
        Deletar Tarefa
        </button> 
        </div>
        </div>
  
        `;

  });
}



function reset() {

  document.getElementById("firstSection").innerHTML = `
      <form class="border p-4 mb-4 " id="form">
      <div class="form-group">
          <label>Tarefa</label>
          <input type="text" class="form-control" id="task" placeholder="Digite uma tarefa">
      </div>
  
      <div class="form-group">
          <label>Descrição</label>
          <input type="text" class="form-control" id="description" placeholder="Digite uma descrição">
      </div>
  
      <button type="submit" id="button1" class="btn btn-primary"> <i class="fas fa-plus"></i> Adicionar Tarefa </button>
      <button style="display: none;" id="button2" class="btn btn-success"> Atualizar Tarefa</button>
      <button style="display: none;" id="button3" class="btn btn-danger"> Cancelar</button>
  </form>
      `;

  document.getElementById("form").addEventListener("submit", (e) => {

    var task = document.getElementById("task").value;
    var description = document.getElementById("description").value;
    e.preventDefault();

    // Função para criar uma nova tarefa
    createTask(task, description);

    form.reset();

  });

}


function updateTask(id, name, description) {


  document.getElementById("firstSection").innerHTML = `
    <form class="border p-4 mb-4 " id="form2">
    <div class="form-group">
        <label>Tarefa</label>
        <input type="text" class="form-control" id="task" placeholder="Digite uma tarefa">
    </div>
  
    <div class="form-group">
        <label>Descrição</label>
        <input type="text" class="form-control" id="description" placeholder="Digite uma descrição">
    </div>
  
    <button style="display: none;" type="submit" id="button1" class="btn btn-primary"> <i class="fas fa-plus"></i> Adicionar Tarefa </button>
    <button style="display: inline-block;" type="submit"  id="button2" class="btn btn-success"><i class="fas fa-sync"></i>  Atualizar Tarefa</button>
    <button style="display: inline-block;" id="button3" class="btn btn-danger"><i class="fas fa-ban"></i>  Cancelar</button>
  </form>
    `;

  document.getElementById("form2").addEventListener("submit", (e) => {
    e.preventDefault();
  });
  document.getElementById("button3").addEventListener("click", (e) => {
    reset();
  });
  document.getElementById("button2").addEventListener("click", (e) => {
    updateTask2(id, document.getElementById("task").value, document.getElementById("description").value);
  });

  document.getElementById("task").value = name;
  document.getElementById("description").value = description;
}

function updateTask2(id, name, description) {

  var taskUpdated = {
    task: name,
    id: id,
    description: description
  }

  let db = firebase.database().ref("tasks/" + id);
  db.set(taskUpdated);
  document.getElementById("cardSection").innerHTML = '';
  readTask();
  reset();

  Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'Tarefa atualizada com sucesso',
    showConfirmButton: false,
    timer: 2000
  });
}

function deleteTask(id) {

  var task = firebase.database().ref("tasks/" + id);
  task.remove();
  reset();
  document.getElementById("cardSection").innerHTML = '';
  readTask();
  Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'Tarefa deletada com sucesso',
    showConfirmButton: false,
    timer: 2000
  });

}

function resetarLogout() {

  document.getElementById("cardSection").innerHTML = '';

}










