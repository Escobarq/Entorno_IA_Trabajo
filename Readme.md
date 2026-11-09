# IDEA 1

## Conjunto de Herramientas para agentes de AI

### Objetivo

Automatizar la instalacion y configuracion de herramientas para mejorar la experiencia con agentes de inteligencia artificial, manteniendo una experiencia clara, ordenada y segura en una interfaz TUI.

### Reglas del proyecto

1. Cada herramienta debe tener un nombre unico y descriptivo.
2. Cada herramienta debe incluir una descripcion clara de su finalidad, uso principal y contexto de instalacion.
3. Cada herramienta debe tener una lista de comandos recomendados por sistema operativo, con soporte para Windows, Linux y macOS.
4. La seleccion de comandos debe realizarse automaticamente segun el sistema operativo detectado por el entorno.
5. El proyecto debe partir por una base inicial de herramientas: Bun, Node.js y Python.
6. La interfaz debe estar separada por pantallas y archivos, nunca toda la logica en un unico archivo.
7. La pantalla principal debe ser una bienvenida simple y corta, con la accion de continuar a la pantalla de instalacion.
8. La pantalla de instalacion debe mostrar la lista de herramientas, su descripcion y el comando recomendado para el sistema actual.
9. Cuando el usuario presione Enter sobre una herramienta, debe abrirse una vista de logs aparte, sin mezclar la salida con la terminal del sistema.
10. La salida de instalacion debe capturarse con `node:child_process` y almacenarse en memoria para mostrarse dentro de la interfaz.
11. La terminal del sistema debe mantenerse limpia; no se debe usar `stdio: inherit` para la instalacion de dependencias dentro de esta app.
12. El flujo de navegacion debe permitir volver con Escape a la lista anterior sin perder el estado del menu ni romper la experiencia.
13. Cada herramienta debe poder intentarse de nuevo despues de ver los logs, sin que quede un estado sucio o una pantalla bloqueada.
14. El nivel de salida debe ser legible, ordenado y controlado, sin emojis ni caracteres visuales que compitan con la terminal.
15. Si se requiere formatear mensajes, se debe usar `node:util` para construir mensajes de log mas claros y consistentes.
16. Toda la UI debe mantenerse en TypeScript con tipado estricto y estructura modular.
17. Antes de cerrar una funcionalidad, se debe validar con `bun run typecheck` para asegurar que no haya errores de compilacion.
18. Las decisiones de diseño deben priorizar claridad, simplicidad y mantenimiento sobre complejidad visual innecesaria.

### Reglas adicionales de implementacion

- No se debe usar emojis en la terminal ni en el texto de la interfaz.
- Los mensajes deben ser tecnicos y claros, preferiblemente en español para la experiencia del usuario.
- La estructura recomendada es:
  - `index.tsx` para arranque de la app
  - `src/screens/` para pantallas de bienvenida, instalacion y logs
  - `src/components/` para piezas reutilizables
  - `src/data/` para catalogos y comandos
- La instalacion debe estar enfocada en primer lugar en herramientas esenciales para desarrollar con IA y agentes:
  - Bun
  - Node.js
  - Python
- No se deben incluir herramientas adicionales antes de completar la base inicial.
- La app debe evitar logica dispersa y mantener cada pantalla con una responsabilidad unica.

### ¿Que busco?

Automatizar la instalacion y configuracion de herramientas para mejorar la experiencia con agentes de inteligencia artificial, reduciendo errores de entorno, acelerando la configuracion inicial y manteniendo una interfaz clara y ordenada para el usuario.
