
document.getElementById("home-form").addEventListener("submit", function(event){
    event.preventDefault()
    event.reset()
});
function changepass(){
    const options = {
    method: "POST",
    body: JSON.stringify({
      password: document.getElementById("password").value,
    }),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  };
  fetch("/api/changepassword", options)
  .then((response) => response.json())
  .then((response) => {
    if(response.status == 'success'){
        document.getElementById('alert').innerHTML = `
      <div class="alert alert-success alert-dismissible fade show" role="alert" id="">
        <strong><i class="fa-solid fa-circle-check"></i></strong> Senha alterada com successo!<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>      
      </div>`
      document.getElementById("home-form").reset()
    }
  })
}