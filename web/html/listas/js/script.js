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
        const dropdown = document.querySelector('.dropdown');
        
        if (rol === 'alumno') {
            alert('No tienes permisos para acceder a esta página.');
            window.location.href = '../../index.html';
        } else if (rol === 'docente') {
            alert('No tienes permisos para acceder a esta página.');
            window.location.href = '../../index.html';
        } else if (rol === 'directivo') {
            dropdown.style.display = 'none';
            reportesLink.style.display = 'none';
        }
        return true;
    }

}

function cerrarSesion() {
    localStorage.removeItem('idUsuario');
    localStorage.removeItem('rol');

    window.location.href = '../../login.html';
}
