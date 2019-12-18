window.onload = initialize;
var file;
var storageRef;
var imagesFBRef;

function initialize() {

  file = document.getElementById("file");
  file.addEventListener("change", uploadimagetofirebase, false);
  storageRef = firebase.storage().ref();
  imagesFBRef = firebase.database().ref().child("notas");
 
  showimagesfromfirebase();
}

function showimagesfromfirebase() {
  imagesFBRef.on("value", function (snapshot) {
    var data = snapshot.val();
    var result = "";
    for (var key in data) {
      result += '<img style="margin-left: 30px" width="250" height="250"  class="img-thumbnail" src="' + data[key].url + '"/>';
    }
    document.getElementById("firebaseimages").innerHTML = result;
  })
}

function uploadimagetofirebase() {
  var imagetoupload = file.files[0];
  var uploadTask = storageRef.child('notas/' + imagetoupload.name).put(imagetoupload);
  document.getElementById("progress").className = "";


  uploadTask.on('state_changed', function (snapshot) {
 
    var progressbarvar = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    document.getElementById("progress-bar-id").style.width = progressbarvar + "%"
    console.log('Carregamento está em ' + progress + '% completo');
    switch (snapshot.state) {
      case firebase.storage.TaskState.PAUSED: // or 'paused'
        console.log('Carregamento pausado');
        break;
      case firebase.storage.TaskState.RUNNING: // or 'running'
        console.log('Carregando a imagem');
        break;
    }
  }, function (error) {
   
    alert("Erro ao carregar a imagem");
  }, function () {
  
    var downloadURL = uploadTask.snapshot.downloadURL;

    createnodeinfirebase(imagetoupload.name, downloadURL);
    document.getElementById("progress").className = "hidden";
  });
}

function createnodeinfirebase(imagename, downloadURL) {
  imagesFBRef.push({ name: imagename, url: downloadURL });
}
