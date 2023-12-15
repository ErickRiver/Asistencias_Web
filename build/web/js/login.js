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

function login() {
    var u = document.getElementById("txtUsuario").value;
    var c = document.getElementById("txtContrasenia").value;

    var usuario = {
        username: u,
        contrasenia: c
    };

    datos = {
        datosUsuario: JSON.stringify(usuario)
    };
    
    params = new URLSearchParams(datos);
    fetch("http://localhost:8080/asistencia/api/log/in", {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
        body: params
    })
            .then(response => {
                return response.json();
            })
            .then(function (data) {
                if (data.idUsuario == 0) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Credenciales incorrectas.'
                    });
                } else {
                    localStorage.setItem('idUsuario', data.idUsuario);
                    localStorage.setItem('rol', data.rol);
                    
                    var contenedor = document.querySelector('.contenedor-login');
                    contenedor.classList.add('animate__fadeOutUp');

                    setTimeout(function () {
                        window.location.href = 'index.html';
                    }, 1000);
                }
            })
            .catch(error => {
                //console.error('Error:', error);
                alert('Error:', error);
            });
}