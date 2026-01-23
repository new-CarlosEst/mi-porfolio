import emailjs from "@emailjs/browser";

// Selecciono el formulario
const form = document.getElementById("contactForm");

//Me guardo las keys que saco el .env
const publicKey = import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY;
const serviceId = import.meta.env.PUBLIC_EMAILJS_SERVICE_ID;
const templateId = import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID;

//TODO: Funcion para mostrar el mensaje exito o fallo al enviar
if (form) {
    form.addEventListener("submit", async (e) => {
        //Evito que se envie por defecto y que recargue la pagina
        e.preventDefault();

        try{
            //envio el email con el metodo de emailjs
            await emailjs.sendForm(
                serviceId,
                templateId,
                form as HTMLFormElement,
                publicKey
            );
            //TODO: Mostrar un mensaje de exito y limpiar el form

        }catch(error){
            //TODO: Cambiar por un alert o modal personalizado
            console.error("Error al enviar el email:", error);
        }

    });
}
else {
    console.error("No se encontro el formulario");
}
