document.getElementById("registerForm").addEventListener("submit", function(event){
    event.preventDefault()
});
function cadastro(){
    const options = {
    method: "POST",
    body: JSON.stringify({
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    }),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  };

  fetch("/api/oauth/register", options)
  .then((response) => response.json())
  .then((response) => {
    if(response.status == 'success'){
      document.getElementById('alert').innerHTML = `
      <div class="alert alert-success alert-dismissible fade show" role="alert" id="">
        <strong><i class="fa-solid fa-triangle-exclamation"></i></strong> Conta criada com sucesso! Por favor faça o <a href="/login">login</a><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>      
      </div>`
    }else{
      document.getElementById('alert').innerHTML = `
      <div class="alert alert-danger alert-dismissible fade show" role="alert" id="">
        <strong><i class="fa-solid fa-triangle-exclamation"></i></strong> Ops! Parece que essa conta já exite! Por favor faça o <a style="color: #58151C" href="/login">login</a><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>      
      </div>`
    }
  })
}