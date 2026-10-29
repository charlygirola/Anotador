# Anotador de juegos

App web para Android, sin dependencias ni herramientas de compilación. Empezamos por el 7000: puntos manuales, turnos, guardado local, deshacer y doce festejos aleatorios. Para entrar, cada jugador necesita al menos 750 puntos en un mismo turno. Después puede sumar desde 50 puntos. Todos los puntajes deben ser múltiplos de 50. «Sin puntos» pasa el turno sin sumar ni habilitar la entrada. No permite superar 7000; gana quien llega exactamente. El ingreso del puntaje no interpreta dados ni verifica combinaciones de una tirada: valida el total ingresado.

## Publicar gratis en GitHub Pages

1. Entrar a https://github.com/new con la cuenta **charlygirola**.
2. Crear un repositorio **público** llamado `anotador`.
3. Desde **Add file → Upload files**, subir `index.html`, `style.css`, `app.js`, `sw.js`, `manifest.webmanifest`, `icon.svg` y los iconos PNG si están presentes. Confirmar con **Commit changes**.
4. Ir a **Settings → Pages**. En **Source**, elegir **Deploy from a branch**. Seleccionar **main**, carpeta **/(root)** y guardar.
5. Al terminar la publicación, abrir https://charlygirola.github.io/anotador/ desde Chrome en Android.
6. En el menú de Chrome, elegir **Agregar a la pantalla principal** o **Instalar app**, según lo que muestre el teléfono.

Los puntajes se guardan en el navegador de ese dispositivo. Borrar los datos del sitio elimina la partida. No hay sincronización entre celulares. Después de la primera carga completa, la app permite volver a abrir y jugar sin internet.

Para actualizar, reemplazar los archivos en GitHub y cambiar la versión de caché en `sw.js` cuando se modifiquen recursos. Abrir la app con conexión para recibir la actualización.
