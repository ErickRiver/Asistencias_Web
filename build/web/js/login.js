var icon = document.querySelector(".fa-lock");
function togglePassword() {
    var contrasenia = document.getElementById("txtContrasenia");

    if (contrasenia.type === "password") {
        contrasenia.type = "text";
        icon.classList.remove("fa-lock");
        icon.classList.add("fa-unlock");
    } else {
        contrasenia.type = "password";
        icon.classList.remove("fa-unlock");
        icon.classList.add("fa-lock");
    }
}

document.getElementById('btnLogin').addEventListener('click', function () {
    var contenedor = document.querySelector('.contenedor-login');
    contenedor.classList.add('animate__fadeOutUp');

    setTimeout(function () {
        window.location.href = 'index.html';
    }, 1000);
});
