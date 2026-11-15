# Entorno IA Trabajo

TUI para instalar herramientas de desarrollo y preparar agentes de IA en Windows, Linux y macOS. Los comandos se eligen segun el sistema detectado.

## Inicio

Requisitos: Bun. Para los iconos, configura Hack Nerd Font Mono en Windows Terminal o en la terminal integrada de VS Code.

```sh
bun install
bun run start
```

## Instalación rápida (sin npm)

Puedes descargar y ejecutar el instalador directamente desde HTTP:

### Linux / macOS
```sh
curl -fsSL https://tu-dominio.com/install.sh | bash
```

### Windows (PowerShell)
```powershell
irm https://tu-dominio.com/install.ps1 | iex
```

> Solo usa estos comandos si confías en el origen: descargan y ejecutan código remoto con tus permisos. Para entornos sensibles, instala con `bun install` y ejecuta con `bun run start`.

## Uso

- Flechas arriba/abajo: seleccionar herramienta.
- Enter: ejecutar la instalacion o abrir su configurador.
- Esc: volver a la pantalla anterior.
- C en los logs: abrir una accion de configuracion disponible.

La mayoria de instalaciones muestra su salida en la app. Los asistentes oficiales interactivos reciben temporalmente la terminal y la devuelven al finalizar.

## Listas

- **Entorno base:** Bun, Node.js, Python y OpenCode.
- **Lenguajes y complementos:** UV, Golang y Rust.
- **Gentleman Programming:** OpenSpec, Engram, Gentle AI y Gentleman Guardian Angel.
- **MCP y contexto para IA:** Context7.
- **Herramientas para reducir el consumo:** RTK, Caveman y Ponytail.
- **Vercel Labs:** find-skills.
- **GitHub:** Impeccable y Graphify.

## Integraciones

- **Gentle AI:** configura agentes que ya tienes; no los instala. Su asistente se abre desde los logs despues de instalarlo.
- **Gentleman Guardian Angel:** activa una revision OpenCode antes de cada commit. Al pulsar C, configura el repo Git actual; crea o actualiza `.gga` y agrega el hook. Si `.gga` ya existe, guarda una copia. En Windows requiere Git Bash y `%USERPROFILE%\bin` en el PATH de usuario.
- **RTK:** compacta salidas de comandos. Pulsa C despues de instalar para ejecutar `rtk init -g --opencode`; requiere OpenCode 1.18.29 o posterior.
- **Context7:** ofrece documentacion de librerias actualizada. Su asistente `npx ctx7 setup --opencode` requiere Node.js 22.13 o posterior.
- **Caveman:** instala solo la skill global con `npx skills add JuliusBrussee/caveman -g`; el asistente permite elegir los agentes destino.
- **Ponytail:** instala el plugin global de OpenCode con `opencode plugin add @dietrichgebert/ponytail`; añade modos de trabajo y comandos de revision/auditoria.
- **find-skills:** instala globalmente solo la skill de Vercel Labs con `npx skills add vercel-labs/skills --skill find-skills -g`; requiere Node.js/npx y permite seleccionar los agentes destino.
- **Impeccable:** instala la skill global para OpenCode con `npx impeccable install --providers=opencode --scope=global`; requiere Node.js/npx. Aporta comandos de diseño, crítica y auditoría frontend, además de anotaciones para GitHub Actions.
- **Graphify:** crea un grafo local consultable del código y la documentación. Requiere Python 3.10+ y uv; el paquete oficial de PyPI se llama `graphifyy`. El instalador detecta el agente y registra la skill.

OpenCode se instala con `bun install -g --trust @opencode/cli` en todos los sistemas, incluido Windows.

## Verificacion

```sh
bun run typecheck
```
