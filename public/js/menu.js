function menu(){
    const ul = document.getElementById('listmenu')
    if(ul.className == 'list-menu'){
        ul.setAttribute('class', "responsive")
    }else{
        ul.setAttribute('class', "list-menu")
    }
}
window.addEventListener("resize", (event) => {
    document.getElementById('listmenu').setAttribute('class', "list-menu")
});