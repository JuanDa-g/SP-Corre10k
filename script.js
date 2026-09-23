
let pasoActual = 1;
const totalPasos = 4;


const PRECIOS = {
    '5K':  60000,
    '10K': 70000,
};

document.addEventListener('DOMContentLoaded', () => {
    inicializarHeader();
    inicializarMenuMovil();
    inicializarValidaciones();
});


// ============================================================
// HEADER: Scroll effects & menú móvil
// ============================================================

function inicializarHeader() {
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        // Añadir sombra al hacer scroll
        if (currentScroll > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }

        lastScroll = currentScroll;
    });
}

function inicializarMenuMovil() {
    const toggle = document.getElementById('menuToggle');
    const nav = document.getElementById('mainNav');

    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        nav.classList.toggle('header__nav--open');
    });

    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            nav.classList.remove('header__nav--open');
        });
    });

    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !toggle.contains(e.target)) {
            toggle.classList.remove('active');
            nav.classList.remove('header__nav--open');
        }
    });
}


// ============================================================
// NAVEGACIÓN DEL WIZARD (FORMULARIO MULTI-PASO)
// ============================================================

/**
 * Navega al siguiente paso del wizard.
 * Valida los campos del paso actual antes de avanzar.
 * @param {number} pasoDesde - Paso actual desde el que se quiere avanzar
 */
function siguientePaso(pasoDesde) {
    // Validar paso actual
    if (!validarPaso(pasoDesde)) return;

    const siguientePasoNum = pasoDesde + 1;
    if (siguientePasoNum > totalPasos) return;

    // Si vamos al paso 3 (resumen), llenar los datos
    if (siguientePasoNum === 3) {
        llenarResumen();
    }

    // Si vamos al paso 4 (pago), llenar los datos de pago
    if (siguientePasoNum === 4) {
        llenarDatosPago();
    }

    cambiarPaso(siguientePasoNum);
}

/**
 * Navega al paso anterior del wizard.
 * @param {number} pasoDesde - Paso actual desde el que se quiere retroceder
 */
function anteriorPaso(pasoDesde) {
    const anteriorPasoNum = pasoDesde - 1;
    if (anteriorPasoNum < 1) return;
    cambiarPaso(anteriorPasoNum);
}

/**
 * Cambia visualmente al paso indicado.
 * Actualiza paneles, indicadores de progreso y hace scroll si se requiere.
 * @param {number} nuevoPaso - Número del paso destino
 * @param {boolean} shouldScroll - Indica si debe hacer scroll hacia el formulario
 */
function cambiarPaso(nuevoPaso, shouldScroll = true) {
    const panelActual = document.getElementById(`paso${pasoActual}`);
    if (panelActual) {
        panelActual.classList.remove('wizard__panel--active');
    }

    const panelNuevo = document.getElementById(`paso${nuevoPaso}`);
    if (panelNuevo) {
        panelNuevo.classList.add('wizard__panel--active');
    }

    actualizarProgreso(nuevoPaso);

    pasoActual = nuevoPaso;

    if (shouldScroll) {
        const formularioSection = document.getElementById('formulario');
        if (formularioSection) {
            formularioSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

/**
 * Actualiza los indicadores visuales de progreso del wizard.
 * @param {number} pasoActivo - Paso actualmente activo
 */
function actualizarProgreso(pasoActivo) {
    for (let i = 1; i <= totalPasos; i++) {
        const stepEl = document.querySelector(`.wizard__step[data-step="${i}"]`);
        const lineEl = document.getElementById(`stepLine${i}`);

        if (!stepEl) continue;

        // Reset de clases
        stepEl.classList.remove('wizard__step--active', 'wizard__step--completed');

        if (i < pasoActivo) {
            stepEl.classList.add('wizard__step--completed');
        } else if (i === pasoActivo) {
            stepEl.classList.add('wizard__step--active');
        }

        // Actualizar líneas
        if (lineEl) {
            if (i < pasoActivo) {
                lineEl.classList.add('wizard__step-line--active');
            } else {
                lineEl.classList.remove('wizard__step-line--active');
            }
        }
    }
}


// ============================================================
// VALIDACIÓN DE FORMULARIOS
// ============================================================

function inicializarValidaciones() {
    const numDoc = document.getElementById('numDoc');
    if (numDoc) {
        numDoc.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }

    const celular = document.getElementById('celular');
    if (celular) {
        celular.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^\d\s\+\-]/g, '');
        });
    }
}

/**
 * Valida los campos del paso indicado.
 * @param {number} paso - Número del paso a validar
 * @returns {boolean} true si los campos son válidos
 */
function validarPaso(paso) {
    limpiarErrores();

    switch (paso) {
        case 1:
            return validarPaso1();
        case 2:
            return validarPaso2();
        case 3:
            return true; 
        default:
            return true;
    }
}


function validarPaso1() {
    const campos = {
        nombre: { el: document.getElementById('nombre'), msg: 'El nombre es obligatorio' },
        apellido: { el: document.getElementById('apellido'), msg: 'El apellido es obligatorio' },
        tipoDoc: { el: document.getElementById('tipoDoc'), msg: 'Selecciona el tipo de documento' },
        numDoc: { el: document.getElementById('numDoc'), msg: 'El número de documento es obligatorio' },
        fechaNacimiento: { el: document.getElementById('fechaNacimiento'), msg: 'La fecha de nacimiento es obligatoria' },
        genero: { el: document.getElementById('genero'), msg: 'Selecciona tu género' },
        celular: { el: document.getElementById('celular'), msg: 'El celular es obligatorio' },
        correo: { el: document.getElementById('correo'), msg: 'El correo es obligatorio' },
        correoConfirm: { el: document.getElementById('correoConfirm'), msg: 'Confirma tu correo electrónico' },
        ciudad: { el: document.getElementById('ciudad'), msg: 'La ciudad es obligatoria' },
        departamento: { el: document.getElementById('departamento'), msg: 'El departamento es obligatorio' },
    };

    // Verificar campos vacíos
    for (const [key, campo] of Object.entries(campos)) {
        if (!campo.el.value.trim()) {
            mostrarError('errorPaso1', campo.msg);
            campo.el.classList.add('form-input--error');
            campo.el.focus();
            return false;
        }
    }

    // Validar formato de correo
    const correo = campos.correo.el.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        mostrarError('errorPaso1', 'Ingresa un correo electrónico válido');
        campos.correo.el.classList.add('form-input--error');
        campos.correo.el.focus();
        return false;
    }

    // Validar que los correos coincidan
    if (correo !== campos.correoConfirm.el.value.trim()) {
        mostrarError('errorPaso1', 'Los correos electrónicos no coinciden');
        campos.correoConfirm.el.classList.add('form-input--error');
        campos.correoConfirm.el.focus();
        return false;
    }

    return true;
}


function validarPaso2() {
    const categoria = document.getElementById('categoria');
    const talla = document.getElementById('tallaCamiseta');

    if (!categoria.value) {
        mostrarError('errorPaso2', 'Selecciona una categoría / distancia');
        categoria.classList.add('form-input--error');
        categoria.focus();
        return false;
    }

    if (!talla.value) {
        mostrarError('errorPaso2', 'Selecciona la talla de tu camiseta');
        talla.classList.add('form-input--error');
        talla.focus();
        return false;
    }

    return true;
}

function mostrarError(elementId, mensaje) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
        errorEl.textContent = mensaje;
        errorEl.style.display = 'block';
    }
}


function limpiarErrores() {
    document.querySelectorAll('.form-error').forEach(el => {
        el.style.display = 'none';
        el.textContent = '';
    });

    document.querySelectorAll('.form-input--error').forEach(el => {
        el.classList.remove('form-input--error');
    });
}


// ============================================================
// RESUMEN (PASO 3)
// ============================================================

function llenarResumen() {
    const resumenPersonal = document.getElementById('resumenPersonal');
    const resumenEvento = document.getElementById('resumenEvento');
    const resumenTotal = document.getElementById('resumenTotal');

    if (!resumenPersonal || !resumenEvento) return;

    const datosPersonales = [
        { label: 'Nombre', value: `${obtenerValor('nombre')} ${obtenerValor('apellido')}` },
        { label: 'Documento', value: `${obtenerValor('tipoDoc')} ${obtenerValor('numDoc')}` },
        { label: 'Fecha de nacimiento', value: obtenerValor('fechaNacimiento') },
        { label: 'Género', value: obtenerTextoSelect('genero') },
        { label: 'Celular', value: obtenerValor('celular') },
        { label: 'Correo', value: obtenerValor('correo') },
        { label: 'Ciudad / Depto.', value: `${obtenerValor('ciudad')}, ${obtenerValor('departamento')}` },
    ];

    resumenPersonal.innerHTML = datosPersonales.map(item => `
        <div class="resumen__item">
            <div class="resumen__item-label">${item.label}</div>
            <div class="resumen__item-value">${item.value || '—'}</div>
        </div>
    `).join('');

    const categoriaValue = obtenerValor('categoria');
    const precio = PRECIOS[categoriaValue] || 0;

    const datosEvento = [
        { label: 'Categoría', value: obtenerTextoSelect('categoria') },
        { label: 'Talla camiseta', value: obtenerValor('tallaCamiseta') },
        { label: 'Grupo sanguíneo', value: obtenerTextoSelect('grupoSanguineo') || 'No indicado' },
    ];

    resumenEvento.innerHTML = datosEvento.map(item => `
        <div class="resumen__item">
            <div class="resumen__item-label">${item.label}</div>
            <div class="resumen__item-value">${item.value || '—'}</div>
        </div>
    `).join('');

    // Total
    if (resumenTotal) {
        resumenTotal.textContent = formatearPrecio(precio);
    }
}


// ============================================================
// PAGO (PASO 4)
// ============================================================

function llenarDatosPago() {
    const categoriaValue = obtenerValor('categoria');
    const precio = PRECIOS[categoriaValue] || 0;

    const pagoCategoria = document.getElementById('pagoCategoria');
    const pagoTotal = document.getElementById('pagoTotal');

    if (pagoCategoria) {
        pagoCategoria.textContent = obtenerTextoSelect('categoria');
    }
    if (pagoTotal) {
        pagoTotal.textContent = formatearPrecio(precio);
    }
}

// ============================================================
// LLAVE PÚBLICA DE WOMPI (sandbox → producción cuando estés listo)
// ============================================================
const WOMPI_PUBLIC_KEY = 'pub_test_WZI2WxW8FEXeQ8rHWVZq9pyGlqpzedqy';

// URL a la que Wompi redirige al usuario después de pagar.
// Puede ser tu página principal con un parámetro para mostrar un mensaje.
const WOMPI_REDIRECT_URL = 'https://sp-corre10k.vercel.app/?pago=completado';


/**
 * Maneja el click en "Confirmar y Pagar".
 * 1. Guarda la inscripción como PENDIENTE en Sheets (vía Apps Script).
 * 2. Apps Script devuelve la firma SHA-256 y el monto en centavos.
 * 3. Redirige al usuario a Wompi Web Checkout.
 */
async function confirmarPago() {
    const btnPagar = document.getElementById('btnPagar');

    // Mostrar spinner
    btnPagar.disabled = true;
    btnPagar.innerHTML = `
        <svg class="spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12a9 9 0 11-6.219-8.56"/>
        </svg>
        Procesando...
    `;

    const datosInscripcion = recolectarDatosFormulario();
    const referencia = 'INS-' + Date.now().toString(36).toUpperCase();
    datosInscripcion.id = referencia;
    

    try {
        // 1. Guardar en Sheets (estado PENDIENTE) y obtener la firma de Wompi
        const resultado = await guardarInscripcionPendiente(datosInscripcion);

        if (!resultado || resultado.status !== 'success') {
            throw new Error(resultado?.message || 'Error al guardar la inscripción.');
        }

        // 2. Construir la URL de Wompi Web Checkout
        const wompiParams = new URLSearchParams({
            'public-key':          WOMPI_PUBLIC_KEY,
            'currency':            'COP',
            'amount-in-cents':     resultado.montoCentavos,
            'reference':           referencia,
            'signature:integrity': resultado.firma,
            'redirect-url':        WOMPI_REDIRECT_URL,
        });

        const wompiURL = `https://checkout.wompi.co/p/?${wompiParams.toString()}`;

        // 3. Redirigir al usuario a Wompi (misma pestaña)
        window.location.href = wompiURL;

    } catch (error) {
        console.error('Error al iniciar el pago:', error);
        alert('Hubo un problema al iniciar el pago. Por favor inténtalo de nuevo.');

        // Restaurar botón
        btnPagar.disabled = false;
        btnPagar.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            Confirmar y pagar
        `;
    }
}


/**
 * Envía los datos de la inscripción a Google Apps Script.
 * Apps Script guarda la fila en Sheets con estado PENDIENTE y
 * devuelve la firma de integridad SHA-256 requerida por Wompi.
 *
 * @param {Object} datos - Datos completos del formulario
 * @returns {Promise<{status, referencia, firma, montoCentavos}>}
 */
async function guardarInscripcionPendiente(datos) {
    datos.fechaRegistro = new Date().toISOString();

    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzjkWhSC3XDB24YTZ0VRkkNCs_Svj9-gOLvqR1jPbazy659OXiRi3bUL6jIo2DGTx_y/exec';

    const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        redirect: 'follow',
        body: JSON.stringify({ accion: 'guardarInscripcion', ...datos }),
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    });

    return await response.json();
}


/**
 * =============================================
 * INTEGRACIÓN FUTURA: INICIALIZAR PASARELA DE PAGO
 * =============================================
 * Esta función inicializará el widget/SDK de la pasarela
 * de pago elegida y lo renderizará en #pagoContainer.
 *
 * @param {string} proveedor - 'wompi' | 'payu' | 'mercadopago'
 * @param {Object} config - Configuración del pago
 */
function inicializarPasarelaPago(proveedor, config) {
    // TODO: Implementar según el proveedor elegido
    console.log(`💳 [inicializarPasarelaPago] Proveedor: ${proveedor}`, config);
}


// ============================================================
// FUNCIONES AUXILIARES
// ============================================================

/**
 * Recolecta todos los datos del formulario en un objeto.
 * @returns {Object} Datos completos de la inscripción
 */
function recolectarDatosFormulario() {
    const categoriaValue = obtenerValor('categoria');
    const precio = PRECIOS[categoriaValue] || 0;

    return {
        // Datos personales
        nombre: obtenerValor('nombre'),
        apellido: obtenerValor('apellido'),
        tipoDocumento: obtenerValor('tipoDoc'),
        numeroDocumento: obtenerValor('numDoc'),
        fechaNacimiento: obtenerValor('fechaNacimiento'),
        genero: obtenerValor('genero'),
        celular: obtenerValor('celular'),
        correo: obtenerValor('correo'),
        ciudad: obtenerValor('ciudad'),
        departamento: obtenerValor('departamento'),

        // Datos del evento
        categoria: categoriaValue,
        categoriaTexto: obtenerTextoSelect('categoria'),
        tallaCamiseta: obtenerValor('tallaCamiseta'),
        grupoSanguineo: obtenerValor('grupoSanguineo'),

        // Pago
        total: precio,
        totalFormateado: formatearPrecio(precio),
        estadoPago: 'PENDIENTE' // Se actualizará cuando la pasarela confirme
    };
}

/**
 * Obtiene el valor de un campo del formulario.
 * @param {string} id - ID del elemento
 * @returns {string} Valor del campo
 */
function obtenerValor(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
}

/**
 * Obtiene el texto visible de la opción seleccionada en un select.
 * @param {string} id - ID del select
 * @returns {string} Texto de la opción seleccionada
 */
function obtenerTextoSelect(id) {
    const el = document.getElementById(id);
    if (!el || el.selectedIndex < 0) return '';
    return el.options[el.selectedIndex].text;
}

/**
 * Formatea un número como precio en COP.
 * @param {number} valor - Precio en pesos
 * @returns {string} Precio formateado (ej: "$120.000 COP")
 */
function formatearPrecio(valor) {
    return '$' + valor.toLocaleString('es-CO') + ' COP';
}


// ============================================================
// ACCIONES DESDE TARJETAS DE PRUEBA
// ============================================================

/**
 * Inicia el proceso de inscripción pre-seleccionando la distancia.
 * Se llama desde los botones "Inscribirme" de las tarjetas.
 * @param {string} distancia - Distancia seleccionada (5K, 10K)
 */
function iniciarInscripcion(distancia) {
    // Pre-seleccionar la categoría en el formulario
    const categoriaSelect = document.getElementById('categoria');
    if (categoriaSelect) {
        categoriaSelect.value = distancia;
    }

    // Scroll hacia el formulario
    const formularioSection = document.getElementById('formulario');
    if (formularioSection) {
        formularioSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}


// ============================================================
// MODAL DE CONFIRMACIÓN
// ============================================================

/**
 * Muestra el modal de inscripción exitosa.
 * @param {string} referencia - Código de referencia de la inscripción
 */
function mostrarModalExito(referencia) {
    const modal = document.getElementById('modalConfirmacion');
    const refEl = document.getElementById('modalRef');

    if (refEl) {
        refEl.textContent = referencia;
    }

    if (modal) {
        modal.classList.add('modal--visible');
    }
}

/**
 * Cierra el modal de confirmación y resetea el formulario.
 */
function cerrarModal() {
    const modal = document.getElementById('modalConfirmacion');
    if (modal) {
        modal.classList.remove('modal--visible');
    }
    
    limpiarFormulario();
}


function limpiarFormulario() {
    document.querySelectorAll('.form-input').forEach(input => {
        if (input.tagName === 'SELECT') {
            input.selectedIndex = 0;
        } else {
            input.value = '';
        }
    });

    limpiarErrores();

    cambiarPaso(1, false);

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}


// ============================================================
// CSS ANIMATION: Spinner de carga
// ============================================================
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    .spin {
        animation: spin 1s linear infinite;
    }
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(styleSheet);
