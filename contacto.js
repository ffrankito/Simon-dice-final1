// Obtenemos el formulario de contacto por su ID
var formularioContacto = document.getElementById('contactForm');

formularioContacto.addEventListener('submit', function(evento) {
    evento.preventDefault();
    if (validarFormulario()) {
        enviarEmail();
    }
});
// Función para validar el formulario
function validarFormulario() {
    var nombre = formularioContacto.elements['name'].value;
    var email = formularioContacto.elements['email'].value;
    var mensaje = formularioContacto.elements['message'].value;

    if (!nombre.match(/^[a-zA-Z0-9\s]+$/)) {
        alert('Nombre inválido. Solo se permiten caracteres alfanuméricos.');
        return false;
    }

    if (!validarEmail(email)) {
        alert('Email inválido.');
        return false;
    }

    if (mensaje.length < 5) {
        alert('El mensaje debe tener al menos 5 caracteres.');
        return false;
    }

    return true;
}
// Función para validar un email usando una expresión regular
function validarEmail(email) {
    var patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return patronEmail.test(email);
}
// Función para enviar el email
function enviarEmail() {
    var email = document.getElementById("email").value;
    var nombre = document.getElementById("name").value;
    var mensaje = document.getElementById("message").value;

    var subject = 'Mensaje desde el formulario de contacto';
    var emailBody = 'Nombre: ' + nombre + '\nEmail: ' + email + '\nMensaje: ' + mensaje;

    var mailtoLink = 'mailto:' + email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(emailBody);

    // Abre el cliente de correo predeterminado con los datos del formulario
    window.open(mailtoLink);
}
