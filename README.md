# Sistema de Registro de Equipos - U.E.T.H. "LAS ROSAS"

Dashboard completo para la gestión de equipos del Campeonato de Secundaria - Promoción 2026.

## Stack Tecnológico
- **Framework**: Next.js 15 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Base de Datos**: PostgreSQL (Aiven)
- **ORM**: Prisma
- **Autenticación**: iron-session (Cookies httpOnly)

## Configuración de Aiven PostgreSQL
1. Crea un proyecto en [Aiven.io](https://aiven.io/).
2. Crea un servicio de PostgreSQL.
3. Descarga el certificado CA (ca.pem) o copia su contenido.
4. Obtén la URL de conexión (Service URI).
5. Asegúrate de incluir `sslmode=verify-full` en la URL de conexión.

## Variables de Entorno (.env)
Crea un archivo `.env` basado en `.env.example`:
```env
DATABASE_URL="postgresql://avnadmin:tu_password@host:port/defaultdb?sslmode=verify-full"
SESSION_SECRET="un_secreto_muy_largo_de_al_menos_32_caracteres"
ADMIN_USER="admin"
ADMIN_PASSWORD="password123"
```

## Instalación y Despliegue Local
1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Genera el cliente de Prisma:
   ```bash
   npx prisma generate
   ```
3. Ejecuta las migraciones (opcional si la BD ya existe):
   ```bash
   npx prisma db push
   ```
4. Ejecuta el seed para crear el administrador inicial:
   ```bash
   npx prisma db seed
   ```
5. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Despliegue en Vercel
1. Sube el código a un repositorio de GitHub.
2. Conecta el repositorio en Vercel.
3. Configura las Variables de Entorno en el panel de Vercel.
4. El comando de build ejecutará automáticamente `prisma generate` gracias al script `postinstall` en `package.json`.

## Roles y Permisos
- **Administrador**: Puede gestionar gestores y todos los equipos.
- **Gestor**: Puede registrar equipos y gestionar los equipos que él mismo creó.
- **Visitante**: Solo puede ver la lista de equipos inscritos.

---
Desarrollado por **SILVERMAN** – 2026 ©
