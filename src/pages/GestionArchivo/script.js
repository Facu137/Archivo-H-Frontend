document.getElementById('createFormBtn').addEventListener('click', function() {
  document.getElementById('fileForm').classList.remove('hidden');
});

document.getElementById('fileType').addEventListener('change', function() {
  const fileType = this.value;
  const formFields = document.getElementById('formFields');
  formFields.innerHTML = '';

  const fields = {
      Mensura: ['numeroLegajo', 'legajoBis', 'numeroExpediente', 'expedienteBis', 'DepartamentoAntiguo', 'DepartamentoActual', 'Lugar', 'dia', 'mes', 'año', 'Titular', 'Carátula', 'Propiedad', 'Fojas'],
      Notarial: ['Escribano', 'Registro', 'Protocolo', 'MesInicio', 'MesFin', 'dia', 'mes', 'año', 'EscrituraNº', 'Iniciador', 'Extracto', 'NegocioJuridico', 'Folio'],
      Correspondencia: ['numeroLegajo', 'legajoBis', 'numeroExpediente', 'expedienteBis', 'dia', 'mes', 'año', 'Emisor', 'Destinatario', 'Asunto', 'Fojas'],
      Leyes_Decretos: ['numeroLegajo', 'legajoBis', 'numeroExpediente', 'expedienteBis', 'dia', 'mes', 'año', 'Emisor', 'Destinatario', 'Asunto', 'Fojas'],
      Gobierno: ['numeroLegajo', 'legajoBis', 'numeroExpediente', 'expedienteBis', 'dia', 'mes', 'año', 'Iniciador', 'Carátula', 'Tema', 'Folios'],
      Tierras_Fiscales: ['numeroLegajo', 'legajoBis', 'numeroExpediente', 'expedienteBis', 'dia', 'mes', 'año', 'Iniciador', 'Carátula', 'Tema', 'Folios'],
      Tribunales: ['numeroLegajo', 'legajoBis', 'numeroExpediente', 'expedienteBis', 'dia', 'mes', 'año', 'Iniciador', 'Carátula', 'Tema', 'Folios']
  };

  fields[fileType].forEach(field => {
      const label = document.createElement('label');
      label.textContent = field;
      const input = document.createElement('input');
      input.type = 'text';
      input.name = field;
      formFields.appendChild(label);
      formFields.appendChild(input);

      if (['Iniciador', 'Titular', 'Escribano', 'Emisor', 'Destinatario'].includes(field)) {
          const personType = document.createElement('div');
          personType.className = 'person-type';
          const physLabel = document.createElement('label');
          physLabel.textContent = 'Física';
          const physInput = document.createElement('input');
          physInput.type = 'radio';
          physInput.name = `${field}Type`;
          physInput.value = 'Física';
          const jurLabel = document.createElement('label');
          jurLabel.textContent = 'Jurídica';
          const jurInput = document.createElement('input');
          jurInput.type = 'radio';
          jurInput.name = `${field}Type`;
          jurInput.value = 'Jurídica';
          personType.appendChild(physLabel);
          personType.appendChild(physInput);
          personType.appendChild(jurLabel);
          personType.appendChild(jurInput);
          formFields.appendChild(personType);
      }
  });

  const fileUploads = document.getElementById('fileUploads');
  fileUploads.innerHTML = '';
  const fileLabel = document.createElement('label');
  fileLabel.textContent = 'Archivos (imágenes o PDFs):';
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.name = 'files';
  fileInput.multiple = true;
  fileUploads.appendChild(fileLabel);
  fileUploads.appendChild(fileInput);
});

document.getElementById('fileForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const formData = new FormData(this);

  // Validaciones con Zod
  const schema = zod.object({
      numeroLegajo: zod.string().nonempty(),
      legajoBis: zod.string().optional(),
      numeroExpediente: zod.string().nonempty(),
      expedienteBis: zod.string().optional(),
      DepartamentoAntiguo: zod.string().optional(),
      DepartamentoActual: zod.string().optional(),
      Lugar: zod.string().optional(),
      dia: zod.number().int().positive(),
      mes: zod.number().int().positive().max(12),
      año: zod.number().int().positive().min(1900).max(new Date().getFullYear()),
      Titular: zod.string().nonempty(),
      Carátula: zod.string().optional(),
      Propiedad: zod.string().optional(),
      Fojas: zod.number().int().positive().optional(),
      Escribano: zod.string().optional(),
      Registro: zod.string().optional(),
      Protocolo: zod.string().optional(),
      MesInicio: zod.string().optional(),
      MesFin: zod.string().optional(),
      EscrituraNº: zod.string().optional(),
      Iniciador: zod.string().nonempty(),
      Extracto: zod.string().optional(),
      NegocioJuridico: zod.string().optional(),
      Folio: zod.string().optional(),
      Emisor: zod.string().nonempty(),
      Destinatario: zod.string().nonempty(),
      Asunto: zod.string().optional(),
      Tema: zod.string().optional(),
      Folios: zod.string().optional(),
      files: zod.array(zod.instanceof(File)).nonempty()
  });

  try {
      schema.parse(Object.fromEntries(formData));
      // Aquí puedes enviar formData al servidor usando fetch o XMLHttpRequest
      console.log(Object.fromEntries(formData));
  } catch (error) {
      console.error('Validation error:', error);
  }
});