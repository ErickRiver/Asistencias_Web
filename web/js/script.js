function toggleNavbar() {
    var navbar = document.querySelector('.navbar');
    navbar.classList.toggle('active');
}


function closeNavbarOutsideClick(event) {
    var navbar = document.querySelector('.navbar');
    var icon = document.querySelector('#navbar-icon');

    if (!navbar.contains(event.target) && event.target !== icon) {
        navbar.classList.remove('active');
    }
}
document.addEventListener('click', closeNavbarOutsideClick);

validarSesion();
function validarSesion() {
    const idUsuario = localStorage.getItem('idUsuario');

    if (!idUsuario || idUsuario === "" || idUsuario === "0" || idUsuario === null) {
        window.location.href = 'login.html';
        return false;
    } else {
        return true;
    }
}

function cerrarSesion() {
    localStorage.removeItem('idUsuario');

    window.location.href = 'login.html';
}
