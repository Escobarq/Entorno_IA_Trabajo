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
11. La terminal del sistema debe mantenerse limpia; las instalaciones se capturan en la app y no usan `stdio: inherit`. Excepcion: una accion interactiva oficial puede recibir la terminal solo despues de suspender la TUI y debe devolver el control al finalizar.
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
- Incluir OpenCode CLI en la lista base con `bun install -g --trust @opencode/cli`. La documentacion oficial advierte que los gestores de paquetes no estan soportados en Windows; en ese sistema se debe preferir el binario independiente oficial.
- Separar el catalogo en listas: entorno base (Bun, Node.js, Python, OpenCode), lenguajes y complementos (UV, Golang, Rust), herramientas de Gentleman Programming (OpenSpec, Engram, Gentle AI, Gentleman Guardian Angel), y herramientas para reducir el consumo (RTK). Deben mostrarse como elementos de su propia lista, nunca en la lista base.
- Usar Bun como metodo de instalacion principal para OpenSpec y conservar sus instaladores oficiales como alternativas por sistema operativo.
- Instalar Engram con Homebrew en Linux/macOS y con `go install` en Windows; usarlo para memoria persistente de proyectos entre sesiones de IA.
- Gentle AI configura agentes de codigo ya instalados; no instala agentes. Integra memoria Engram, el flujo ODD, skills y herramientas MCP, con revision RDD opcional. El comando `@main` instala cambios de desarrollo; `@latest` corresponde a la version estable. `go install` no agrega automaticamente su carpeta de binarios al `PATH`; verificar con `gentle-ai version` despues de configurar el `PATH`.
- Despues de instalar Gentle AI, permitir abrir su configurador oficial desde la pantalla de logs; suspender la TUI mientras se ejecuta y restaurarla al terminar.
- Instalar Gentleman Guardian Angel con Homebrew en Linux/macOS o mediante su instalador Bash en Windows (requiere Git Bash). En Windows, agregar `%USERPROFILE%\bin` al PATH de usuario para que los futuros hooks encuentren `gga`. Tras instalarlo, la accion `C` de los logs valida OpenCode y el repositorio Git actual, respalda `.gga` si existe, establece `PROVIDER="opencode"` y registra el hook pre-commit oficial; sin esa accion no se modifica ningun repositorio.
- Instalar RTK con Homebrew en macOS/Linux o winget en Windows; el script oficial es una alternativa para Linux/macOS. La integracion con OpenCode requiere la version 1.18.29 o posterior. Tras instalarlo, la accion `C` ejecuta `rtk init -g --opencode` para activar globalmente el hook de compactacion de comandos.
- No se deben incluir herramientas adicionales antes de completar la base inicial.
- La app debe evitar logica dispersa y mantener cada pantalla con una responsabilidad unica.

### ¿Que busco?

Automatizar la instalacion y configuracion de herramientas para mejorar la experiencia con agentes de inteligencia artificial, reduciendo errores de entorno, acelerando la configuracion inicial y manteniendo una interfaz clara y ordenada para el usuario.
