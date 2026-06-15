import emailjs from "@emailjs/browser";

// Selecciono el formulario
const form = document.getElementById("contactForm");

//Me guardo las keys que saco el .env
const publicKey = import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY;
const serviceId = import.meta.env.PUBLIC_EMAILJS_SERVICE_ID;
const templateId = import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID;

//Guardo el código de los svg con el tick y el error
const tickSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="h-6 w-6"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m1.75 9.75 2.5 2.5m3.5-4 2.5-2.5m-4.5 4 2.5 2.5 6-6.5"/></svg>';
const errorSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-6 w-6"><path fill="currentColor" d="M12 16.462q.262 0 .439-.177q.176-.177.176-.439q0-.261-.177-.438T12 15.23t-.438.177t-.177.438t.177.439t.438.177m-.5-3.308h1v-6h-1zM12.003 21q-1.866 0-3.51-.708q-1.643-.709-2.859-1.924t-1.925-2.856T3 12.003t.709-3.51Q4.417 6.85 5.63 5.634t2.857-1.925T11.997 3t3.51.709q1.643.708 2.859 1.922t1.925 2.857t.709 3.509t-.708 3.51t-1.924 2.859t-2.856 1.925t-3.509.709"/></svg>';

//Crea un contenedor para los toasts si no existe
const getToastContainer = () => {
    const existing = document.getElementById("toast-container");
    if (existing) return existing;

    const container = document.createElement("div");
    container.id = "toast-container";
    container.className = "fixed left-1/2 top-6 z-[9999] flex -translate-x-1/2 flex-col gap-3";
    document.body.appendChild(container);
    return container;
};

//Crea un toast con el mensaje de éxito o error
function mostrarMensaje(operacion: string){
    const mensaje = document.createElement("div");

    const baseClass = "flex items-center gap-4 rounded-2xl border px-6 py-4 shadow-lg backdrop-blur-sm transition-all duration-300";
    const startClass = "opacity-0 translate-y-2";
    const iconBase = "flex h-12 w-12 items-center justify-center rounded-full";

    let wrapperClass = "";
    let iconClass = "";
    let icon = "";
    let text = "";

    if (operacion === "exito"){
        wrapperClass = `${baseClass} toast-exito bg-blue-900/20 text-blue-400 border-blue-500/30`;
        iconClass = `${iconBase} bg-blue-500/20 text-blue-400`;
        icon = tickSvg;
        text = "Mensaje enviado";
    }
    else if (operacion === "error"){
        wrapperClass = `${baseClass} toast-error bg-red-900/20 text-red-400 border-red-500/30`;
        iconClass = `${iconBase} bg-red-500/20 text-red-400`;
        icon = errorSvg;
        text = "Error al enviar el mensaje";
    }
    else {
        return;
    }

    mensaje.className = `${wrapperClass} ${startClass}`;
    mensaje.setAttribute("role", "status");
    mensaje.innerHTML = `
        <div class="${iconClass}">${icon}</div>
        <div class="text-xl font-semibold">${text}</div>
    `;

    const container = getToastContainer();
    container.appendChild(mensaje);

    requestAnimationFrame(() => {
        mensaje.classList.remove("opacity-0", "translate-y-2");
    });

    //Para que desaparezca el toast después de 3.5 segundos
    window.setTimeout(() => {
        mensaje.classList.add("opacity-0", "translate-y-2");
        window.setTimeout(() => {
            mensaje.remove();
        }, 300);
    }, 3500);
}

//Si no está el form
if (form) {
    form.addEventListener("submit", async (e) => {
        //Evito que se envíe por defecto y que recargue la página
        e.preventDefault();

        try{
            //envío el email con el método de emailjs
            await emailjs.sendForm(
                serviceId,
                templateId,
                form as HTMLFormElement,
                publicKey
            );
            mostrarMensaje("exito");
            (form as HTMLFormElement).reset();

        }catch(error){
            console.error("Error al enviar el email:", error);
            mostrarMensaje("error");
        }

    });
}
else {
    console.error("No se encontró el formulario");
}
