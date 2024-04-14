document.getElementById("loginForm").addEventListener("submit", function(event){
    event.preventDefault()
});
function sendMail(){
    const options = {
    method: "POST",
    body: JSON.stringify({
      email: document.getElementById("email").value,
    }),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  };
  fetch("/api/oauth/forgetpassword/email", options)
  .then((response) => response.json())
  .then((response) => {
    if(response.status == 'success'){
        document.getElementById('alert').innerHTML = `
      <div class="alert alert-success alert-dismissible fade show" role="alert" id="">
        <strong><i class="fa-solid fa-circle-check"></i></strong> Email enviado com successo!<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>      
      </div>`
    }else{
      document.getElementById('alert').innerHTML = `
      <div class="alert alert-danger alert-dismissible fade show" role="alert" id="">
        <strong><i class="fa-solid fa-triangle-exclamation"></i></strong> Ops! Algo deu errado, parece que seu email não está cadastrado em nossos sistemas!<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>      
      </div>`
    }
  })
}

function changePassword(){
  if(document.getElementById("newPassword").value == document.getElementById("passwordConfirm").value){
    const options = {
    method: "POST",
    body: JSON.stringify({
      newPass: document.getElementById("newPassword").value,
      token: document.getElementById("token").value,
    }),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  };
  fetch("/api/oauth/forgetpassword/", options)
  .then((response) => response.json())
  .then((response) => {
    if(response.status == 'success'){
        document.getElementById('alert1').innerHTML = `
      <div class="alert alert-success alert-dismissible fade show" role="alert" id="">
        <strong><i class="fa-solid fa-triangle-exclamation"></i></strong> Senha alterada com sucesso! Você já pode fazer login <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>      
      </div>`
    }else{
      document.getElementById('alert1').innerHTML = `
      <div class="alert alert-danger alert-dismissible fade show" role="alert" id="">
        <strong><i class="fa-solid fa-triangle-exclamation"></i></strong> Ops! Parece que o token informado não está correto!<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>      
      </div>`
      console.log(response.message)
    }
  })
  }else{
    document.getElementById('alert1').innerHTML = `
      <div class="alert alert-danger alert-dismissible fade show" role="alert" id="">
        <strong><i class="fa-solid fa-triangle-exclamation"></i></strong> Ops! Algo deu errado, as duas senha inseridas devem ser iguais!<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>      
      </div>`
  }
}