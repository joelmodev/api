function mudarTema(){
    const body = document.body
    if(body.className == 'dark-theme'){
        body.className = "white-theme"
    }else{
        body.className = "dark-theme"
    }
    
    const img = document.querySelectorAll('.brand-img')
    img.forEach(logo => {
        if(logo.className == 'brand-img dark'){
            logo.src = '/img/logo-white.png'
            logo.className = 'brand-img white'
        }else{
            logo.src = '/img/logo-dark.png'
            logo.className = 'brand-img dark'
        }
    });
    
    const theme_icon = document.getElementById('a').className
    if(theme_icon.baseVal.includes('fa-moon')){
        document.getElementById('temabtn').innerHTML = '<a  href="javascript:void(0)"><i id="a" class="fa-solid fa-sun"></i></a>'
    }else{
        document.getElementById('temabtn').innerHTML = '<a  href="javascript:void(0)"><i id="a" class="fa-solid fa-moon"></i></a>'
    }
}