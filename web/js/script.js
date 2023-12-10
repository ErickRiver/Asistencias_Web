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
        window.location.href = 'login.html';
        return false;
    } else {
        const reportesLink = document.getElementById('reportesLink');
        const listasLink = document.getElementById('listasLink');
        const dropdown = document.querySelector('.dropdown');
        const registrarAsistenciasLink = document.getElementById('registrarAsistencias');
        const consultaAsistencias = document.getElementById('consultaAsistencias');

        if (rol === 'alumno') {
            reportesLink.style.display = 'none';
            listasLink.style.display = 'none';
            registrarAsistenciasLink.style.display = 'none';
        } else if (rol === 'docente') {
            listasLink.style.display = 'none';
        } else if (rol === 'directivo') {
            reportesLink.style.display = 'none';
            registrarAsistenciasLink.style.display = 'none';
        }
        return true;
    }
}

function cerrarSesion() {
    localStorage.removeItem('idUsuario');
    localStorage.removeItem('rol');

    window.location.href = 'login.html';
}