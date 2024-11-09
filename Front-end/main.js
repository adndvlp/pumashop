// Función para alternar entre las diferentes secciones
function showSection(sectionId) {
    var sections = document.querySelectorAll('.section');
    sections.forEach(function (section) {
        section.style.display = 'none'; // Oculta todas las secciones
    });
    document.getElementById(sectionId).style.display = 'block'; // Muestra la sección seleccionada
}

// Listeners para cada enlace del menú

document.getElementById('inicio').addEventListener('click', function () {
    showSection('facebookSection');
});

document.getElementById('amigosLink').addEventListener('click', function () {
    showSection('amigosSection');
});

document.getElementById('gruposLink').addEventListener('click', function () {
    showSection('gruposSection');
});

document.getElementById('tiendasLink').addEventListener('click', function () {
    showSection('tiendasSection');
});

document.getElementById('catalogoLink').addEventListener('click', function () {
    showSection('catalogoSection');
});

document.getElementById('configLink').addEventListener('click', function () {
    showSection('configSection');
});

// Listener para el logo que lleva a la página de Facebook
document.getElementById('logo').addEventListener('click', function () {
    showSection('facebookSection');
});

document.getElementById('perfil').addEventListener('click', function () {
    showSection('perfilSection');
});

document.getElementById('editarPerfil').addEventListener('click', function () {
    showSection('editarPerfilSection');
});

document.getElementById('mensajes').addEventListener('click', function () {
    showSection('mensajesSection');
});


// Función para abrir una conversación
function openChat(usuario) {
    document.querySelector('.chat-area h2').innerText = `Conversación con ${usuario}`;
    // Aquí podrías cargar mensajes anteriores o inicializar la conversación
    document.getElementById('chatContent').innerHTML = `
        <p><strong>${usuario}:</strong> ¡Hola! ¿Cómo estás?</p>
        <p><strong>Tú:</strong> ¡Hola! Estoy bien, gracias.</p>`
};

// Enviar mensaje
// Función para enviar el mensaje cuando se presiona Enter o el botón de enviar
document.getElementById('sendButton').addEventListener('click', sendMessage);
document.getElementById('messageInput').addEventListener('keydown', function (event) {
    if (event.key === "Enter") {
        sendMessage();  // Enviar el mensaje al presionar Enter
    }
});

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value;
    if (message) {
        const chatContent = document.getElementById('chatContent');
        chatContent.innerHTML += `<p><strong>Tú:</strong> ${message}</p>`;
        messageInput.value = ''; // Limpiar el campo de entrada
    }
}

const sectionNames = {
    "facebook": "facebookSection",
    "amigos": "amigosSection",
    "grupos": "gruposSection",
    "tiendas": "tiendasSection",
    "catalogo": "catalogoSection",
    "perfil": "PerfilSection",
    "editar perfil": "editarPerfilSection",
    "mensajes": "mensajesSection",
    "configuracion": "configSection"
};

function checkEnterKey(event) {
    // Verificar si la tecla presionada es "Enter"
    if (event.key === "Enter") {
        searchSection();  // Ejecutar la función de búsqueda
    }
}

function searchSection() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const sections = document.querySelectorAll(".section");

    sections.forEach(section => {
        const sectionId = section.id.toLowerCase();
        if (sectionId.includes(input)) {
            section.style.display = "block";
        } else {
            section.style.display = "none";
        }
    });
}

function previewImage(event) {
    const reader = new FileReader();
    reader.onload = function () {
        const output = document.getElementById('previewImagen');
        output.src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
}