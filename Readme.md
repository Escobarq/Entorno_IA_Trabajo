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
19. Para mejor experiencia visual en terminal, se usara la fuente del sistema Windows junto con una fuente de iconos compatible para terminal, priorizando una seleccion estable y legible para herramientas y modelos de IA. La referencia principal sera la familia Windows Terminal / Consolas y, para iconos, se exige la fuente Hack Nerd Font o una variante equivalente compatible con Windows. El objetivo es mantener una apariencia limpia y consistente, sin emojis ni caracteres no soportados por terminales basadas en texto.

20. Los iconos de herramientas y modelos de IA deben representarse con simbolos de terminal compatibles, no con emojis. Ejemplos de uso recomendado:
    - Bun: icono tipo runtime JS / terminal
    - Node.js: icono tipo nodo / ejecutable
    - Python: icono tipo serpiente o terminal
    - UV: icono de paquete y entorno
    - Golang: icono tipo G / terminal
    - Rust: icono tipo rustacean / compilador
    - Claude: icono tipo IA / asistente
    - DeepSeek: icono tipo IA / modelo
    - Gemini: icono tipo estrella o IA
    - ChatGPT: icono tipo burbuja / asistente
    - OpenCode: icono tipo codigo / terminal

21. En la interfaz TUI, cada herramienta y cada modelo de IA debe tener un identificador visual breve basado en texto o simbolos de terminal, nunca emojis ni imagenes rasterizadas.

22. Si se instala o se utiliza una fuente de iconos, debe elegirse una opcion compatible con Windows y practica en terminales, y su uso debe mantenerse limitado a la UI para evitar que el texto se vuelva ilegible o saturado.

23. La referencia visual del sistema debe seguir un criterio: nombres claros, iconos compactos y descripcion corta, priorizando legibilidad en pantallas pequeñas de terminal.

### Requisitos del proyecto

- La app debe ser una TUI (Text User Interface) en TypeScript, ejecutable en terminales Windows, Linux y macOS.
- Utilizar la fuente de Hack Nerd Font o una variante compatible para iconos de terminal.
- En VS Code, configurar la terminal integrada con `Hack Nerd Font Mono` y abrir una terminal nueva para aplicar el cambio en PowerShell o Git Bash.
- Mantener el catalogo de asistentes y modelos de IA separado visualmente de la lista de herramientas instalables.

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
