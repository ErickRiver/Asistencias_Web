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

    if (!idUsuario || idUsuario === "" || idUsuario === "0" || idUsuario === null) {
        window.location.href = '../../login.html';
        return false;
    } else {
        return true;
    }
}

function cerrarSesion() {
    localStorage.removeItem('idUsuario');

    window.location.href = '../../login.html';
}
