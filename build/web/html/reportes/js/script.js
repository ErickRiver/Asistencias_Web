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
    const rol = localStorage.getItem('rol');

    if (!idUsuario || idUsuario === "" || idUsuario === "0" || idUsuario === null) {
        window.location.href = '../../login.html';
        return false;
    } else {
        const reportesLink = document.getElementById('reportesLink');
        const listasLink = document.getElementById('listasLink');
        const registrarAsistenciasLink = document.getElementById('registrarAsistencias');

        if (rol === 'alumno') {
            alert('No tienes permisos para acceder a esta página.');
            window.location.href = '../../index.html';
        } else if (rol === 'docente') {
            listasLink.style.display = 'none';
        } else if (rol === 'directivo') {
            alert('No tienes permisos para acceder a esta página.');
            window.location.href = '../../index.html';
        }
        return true;
    }
}

function cerrarSesion() {
    localStorage.removeItem('idUsuario');
    localStorage.removeItem('rol');

    window.location.href = '../../login.html';
}
