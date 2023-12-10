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

$(document).ready(function () {
    $('.slider').slick({
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        prevArrow: '<button type="button" class="slick-prev"><i class="fas fa-chevron-left"></i></button>',
        nextArrow: '<button type="button" class="slick-next"><i class="fas fa-chevron-right"></i></button>'
    });
});

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

        var urlRegistro = 'http://localhost:8080/asistencia/html/asistencias/registrar.html';

        if (rol === 'alumno') {
            reportesLink.style.display = 'none';
            listasLink.style.display = 'none';
            registrarAsistenciasLink.style.display = 'none';
            if (window.location.href === urlRegistro) {
                alert('No tienes permisos para acceder a esta página.');
                window.location.href = '../../index.html';
            }
        } else if (rol === 'docente') {
            listasLink.style.display = 'none';
        } else if (rol === 'directivo') {
            alert('No tienes permisos para acceder a esta página.');
            window.location.href = '../../index.html';
            if (window.location.href === urlRegistro) {
                alert('No tienes permisos para acceder a esta página.');
                window.location.href = '../../index.html';
            }
        }

        return true;
    }


}

function cerrarSesion() {
    localStorage.removeItem('idUsuario');
    localStorage.removeItem('rol');

    window.location.href = '../../login.html';
}
