# Archivo Histórico SDE - Frontend

Este proyecto es la interfaz de usuario para el sistema de Archivo Histórico de Santiago del Estero, diseñado para gestionar y preservar documentos históricos de manera digital.

## Características Principales

- Gestión de documentos históricos
- Interfaz intuitiva y moderna
- Sistema de búsqueda avanzada
- Visualización de documentos digitalizados
- Categorización y etiquetado de archivos

## Requisitos Previos

- Node.js v20.12.2 LTS o superior
- npm (incluido con Node.js)
- Git

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/Archivo-H-Frontend.git
cd Archivo-H-Frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar el proyecto en modo desarrollo:
```bash
npm run dev
```

## Extensiones Recomendadas de VS Code

Para mejorar tu experiencia de desarrollo, recomendamos instalar las siguientes extensiones:

- **Error Lens** - Mejora la visualización de errores y advertencias
  - [Instalar Error Lens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens)

- **ESLint** - Herramienta de linting para identificar problemas en el código
  - [Instalar ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

- **GitHub Pull Request** - Integración con GitHub para gestionar pull requests
  - [Instalar GitHub Pull Request](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-pull-request-github)

- **Prettier** - Formateador de código
  - [Instalar Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Flujo de Trabajo con Git

1. Siempre crear nuevas ramas desde la rama `desarrollo`:
```bash
git checkout desarrollo
git pull origin desarrollo
git checkout -b feature/nueva-funcionalidad
```

2. Al finalizar los cambios, crear un Pull Request hacia la rama `desarrollo`

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run lint` - Ejecuta el linter para verificar el código
- `npm run test` - Ejecuta las pruebas (si están configuradas)

## Contribuir

1. Fork del repositorio
2. Crear una rama para tu funcionalidad
3. Commit de tus cambios
4. Push a la rama
5. Crear un nuevo Pull Request

## Licencia

Este proyecto está bajo la Licencia [Especificar licencia]