const formData = {
    step1: {},
    step2: {},
    step3: {},
    step4: {},
};

const steps = [
    `
    <div id="step-1">
        <h3>Paso 1: Número de Paquetes</h3>
        <div class="mb-3">
            <label for="num-packages" class="form-label">¿Cuántos paquetes deseas enviar?</label>
            <input type="number" id="num-packages" class="form-control" placeholder="Ej. 2" min="1" required>
        </div>
    </div>
    `,
    `
    <div id="step-2">
        <h3>Paso 2: Detalles de los Paquetes</h3>
        <div id="packages-container"></div>
    </div>
    `,
    `
    <div id="step-3">
        <h3>Paso 3: Opciones de Envío</h3>
        <p>Selecciona una opción de envío disponible:</p>
        <div class="form-check d-flex align-items-center mb-3">
            <input type="radio" id="option1" name="shipping-option" class="form-check-input me-2" required>
            <label class="form-check-label" for="option1">
                <img src="DHLimg.png" alt="DHL" class="me-2" style="width: 50px; height: auto;"> DHL - $150.00
            </label>
        </div>
        <div class="form-check d-flex align-items-center mb-3">
            <input type="radio" id="option2" name="shipping-option" class="form-check-input me-2">
            <label class="form-check-label" for="option2">
                <img src="ETFAimg.png" alt="Estafeta" class="me-2" style="width: 50px; height: auto;"> Estafeta - $120.00
            </label>
        </div>
        <div class="form-check d-flex align-items-center mb-3">
            <input type="radio" id="option3" name="shipping-option" class="form-check-input me-2">
            <label class="form-check-label" for="option3">
                <img src="FDXimg.png" alt="FedEx" class="me-2" style="width: 50px; height: auto;"> FedEx - $180.00
            </label>
        </div>
    </div>
    `,
    `
    <div id="step-4">
        <h3>Paso 4: Información del Cliente</h3>
        <div class="mb-3">
            <label for="sender-name" class="form-label">Nombre del Remitente:</label>
            <input type="text" id="sender-name" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="receiver-name" class="form-label">Nombre del Destinatario:</label>
            <input type="text" id="receiver-name" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="receiver-address" class="form-label">Dirección del Destinatario:</label>
            <textarea id="receiver-address" class="form-control" rows="3" required></textarea>
        </div>
        <div class="mb-3">
            <label for="contact-phone" class="form-label">Teléfono de Contacto:</label>
            <input type="text" id="contact-phone" class="form-control" required>
        </div>
    </div>
    `,
    `
    <div id="step-5">
        <h3>¡Cotización Exitosa!</h3>
        <p>Tu envío ha sido registrado con éxito. Gracias por utilizar nuestro servicio.</p>
    </div>
    `
];

let currentStep = 0;

// Función para cargar un paso
function loadStep(stepIndex) {
    const formSteps = document.getElementById('form-steps');
    formSteps.innerHTML = steps[stepIndex];

    // Rellenar campos con datos almacenados si existen
    const inputs = formSteps.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        const stepKey = `step${stepIndex + 1}`;
        if (formData[stepKey] && formData[stepKey][input.id] !== undefined) {
            input.value = formData[stepKey][input.id];
        }
    });

    if (stepIndex === 1) {
        const numPackages = formData.step1.numPackages;
        if (numPackages) {
            generatePackageFields(numPackages);
        }
    }

    document.getElementById('prev-btn').disabled = stepIndex === 0;
    document.getElementById('next-btn').textContent = stepIndex === steps.length - 2 ? 'Finalizar' : 'Siguiente';
}

// Función para generar campos para los paquetes
function generatePackageFields(numPackages) {
    const container = document.getElementById('packages-container');
    container.innerHTML = '';

    // Si existen datos, prellenar los campos con los datos existentes
    for (let i = 1; i <= numPackages; i++) {
        const packageData = formData.step2[`package${i}`] || {};

        const packageField = `
            <div class="mb-3">
                <h5>Paquete ${i}</h5>
                <label for="dimensions-${i}" class="form-label">Dimensiones (Largo x Ancho x Alto, en cm):</label>
                <input type="text" id="dimensions-${i}" class="form-control" placeholder="Ej. 30x20x15" value="${packageData.dimensions || ''}" required>
                <label for="weight-${i}" class="form-label mt-2">Peso (kg):</label>
                <input type="number" id="weight-${i}" class="form-control" placeholder="Ej. 5.5" value="${packageData.weight || ''}" required>
            </div>
        `;
        container.innerHTML += packageField;
    }
}

// Manejador para avanzar al siguiente paso
document.getElementById('next-btn').addEventListener('click', () => {
    const currentForm = document.querySelector('#form-steps');
    const inputs = Array.from(currentForm.querySelectorAll('input, textarea'));

    // Validar todos los campos requeridos en el paso actual
    const allValid = inputs.every(input => input.checkValidity());
    if (allValid) {
        // Guardar datos actuales en formData
        if (currentStep === 0) {
            const numPackages = parseInt(document.getElementById('num-packages').value, 10);
            formData.step1.numPackages = numPackages;
        }

        if (currentStep === 1) {
            // Guardar datos de cada paquete
            const numPackages = formData.step1.numPackages;
            for (let i = 1; i <= numPackages; i++) {
                formData.step2[`package${i}`] = {
                    dimensions: document.getElementById(`dimensions-${i}`).value,
                    weight: document.getElementById(`weight-${i}`).value
                };
            }
        }

        if (currentStep < steps.length - 1) {
            // Avanzar al siguiente paso
            currentStep++;
            loadStep(currentStep);
        } else {
            // Finalizar y reiniciar formulario
            resetForm();
        }
    } else {
        inputs.forEach(input => {
            if (!input.checkValidity()) input.reportValidity();
        });
    }
});

// Manejador para retroceder al paso anterior
document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentStep > 0) {
        currentStep--;
        loadStep(currentStep);
    }
});

// Función para reiniciar el formulario
function resetForm() {
    // Reiniciar datos almacenados
    for (let key in formData) {
        formData[key] = {};
    }

    // Reiniciar índice de paso
    currentStep = 0;

    // Cargar el primer paso
    loadStep(currentStep);
}

// Cargar el primer paso al inicio
loadStep(currentStep);