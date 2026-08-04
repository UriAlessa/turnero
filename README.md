Turnero

Aplicación SaaS multiempresa para la gestión de servicios, horarios y reservas online.

La plataforma permite que cada negocio cree y administre su propio espacio, configure los servicios que ofrece y defina sus horarios de atención. Los clientes pueden ingresar a la página pública del negocio y reservar un turno sin necesidad de crear una cuenta.

El proyecto se encuentra actualmente en desarrollo con demo disponible: https://turnero-ochre.vercel.app

Funcionalidades

Para negocios

* Registro e inicio de sesión.
* Creación y configuración de un negocio.
* Página pública personalizada mediante un slug único.
* Gestión de servicios.
* Configuración de días y horarios de atención.
* Visualización y administración de reservas.
* Separación de datos entre diferentes negocios.

Para clientes

* Acceso a la página pública de cada negocio.
* Visualización de los servicios disponibles.
* Selección de fecha y horario.
* Creación de reservas sin necesidad de registrarse.
* Generación de un código de confirmación para cada turno.

Arquitectura multiempresa

Cada usuario puede administrar uno o más negocios.

Los servicios, horarios y reservas están relacionados con un negocio específico mediante su identificador. La página pública se genera utilizando un slug único:

https://turnero-ochre.vercel.app/[slug-del-negocio]

Esto permite que diferentes empresas utilicen la misma aplicación manteniendo sus datos separados.

Tecnologías

Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Shadcn UI
* Base UI
* Lucide React
* React Day Picker
* Sonner

Backend

* Next.js Route Handlers
* Auth.js / NextAuth
* Prisma ORM
* bcryptjs

Base de datos

* PostgreSQL

Herramientas

* Git y GitHub
* ESLint
* Vercel

Modelo de datos

La aplicación utiliza las siguientes entidades principales:

* User: usuarios registrados en la plataforma.
* Business: negocios pertenecientes a cada usuario.
* Service: servicios ofrecidos por un negocio.
* BusinessHours: días y horarios de atención.
* Appointment: reservas realizadas por clientes.
* Account, Session y VerificationToken: modelos utilizados por el sistema de autenticación.

Cada reserva almacena la información principal del servicio al momento de su creación y cuenta con un código de confirmación único.

Además, existe una restricción para evitar que un negocio tenga más de una reserva en el mismo horario.

Estado del proyecto

Actualmente se encuentran implementadas las bases principales del producto:

* Autenticación de usuarios.
* Estructura multiempresa.
* Gestión de negocios.
* Gestión de servicios.
* Configuración de horarios.
* Creación y almacenamiento de reservas.
* Página pública por negocio.
* Dashboard administrativo.

El proyecto continúa en desarrollo y puede recibir cambios tanto funcionales como visuales.

Próximas mejoras

* Mejorar y unificar el diseño visual.
* Ampliar las validaciones de formularios y APIs.
* Incorporar una mejor gestión de estados de las reservas.
* Añadir notificaciones en tiempo real para nuevas reservas.
* Ampliar la cobertura de tests.
* Mejorar la documentación técnica.
* Incorporar métricas y estadísticas para los negocios.
* Agregar integraciones externas y notificaciones.

Autor

Desarrollado por Uriel Alessandro.

* Portfolio: urielalessandro.vercel.app
