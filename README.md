# Estadísticas L4D2

App de escritorio (Tauri + React + TypeScript + Tailwind CSS) que muestra el ranking y las estadísticas de un grupo de jugadores de Left 4 Dead 2 Versus, consumiendo una API propia por HTTP.

## Requisitos

- [Node.js](https://nodejs.org/) 20 o superior
- [Rust](https://www.rust-lang.org/tools/install) (vía `rustup`)
- En Windows: [WebView2](https://developer.microsoft.com/microsoft-edge/webview2/) (ya viene instalado en Windows 10/11 actualizados)
- Ver también los [prerequisitos de Tauri](https://tauri.app/start/prerequisites/) para tu sistema operativo

## Instalación

```bash
git clone https://github.com/samuelhuicab/estadisticas-l4d2.git
cd estadisticas-l4d2
npm install
```

Copia el archivo de ejemplo de variables de entorno y coloca tu API key:

```bash
cp .env.example .env
```

Edita `.env`:

```
VITE_API_URL=http://64.177.93.110:5000/api/positions
VITE_API_BASE_URL=http://64.177.93.110:5000
VITE_API_KEY=tu_llave_aqui
```

## Desarrollo

```bash
npm run tauri dev
```

Esto abre la app en una ventana nativa con recarga en caliente (HMR).

## Compilar para producción

```bash
npm run tauri build
```

El instalador queda en `src-tauri/target/release/bundle/`.

## Actualizaciones automáticas

La app trae integrado el [updater de Tauri](https://tauri.app/plugin/updater/): cada vez que abre, revisa en silencio si hay una versión más nueva publicada en GitHub Releases y, si la hay, muestra un banner para instalarla y reiniciar — el usuario no tiene que descargar nada manualmente.

### Cómo sacar una nueva versión

1. Sube el número de versión en **dos** archivos (deben coincidir):
   - `package.json` → `"version"`
   - `src-tauri/tauri.conf.json` → `"version"`
2. Haz commit de ese cambio.
3. Crea y sube un tag con el mismo número, prefijado con `v`:

   ```bash
   git tag v0.2.0
   git push origin v0.2.0
   ```

4. El workflow `.github/workflows/release.yml` se dispara solo: compila la app, la firma, y publica un GitHub Release con los instaladores y el archivo `latest.json` que el updater consulta.
5. En cuanto el Release queda publicado, todas las copias instaladas lo detectan la próxima vez que se abran.

### Configuración única en GitHub (secrets)

Ve a **Settings → Secrets and variables → Actions** en el repo y agrega:

| Secret | Valor |
|---|---|
| `TAURI_SIGNING_PRIVATE_KEY` | Contenido del archivo de llave privada generado con `npm run tauri signer generate` |
| `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` | La contraseña que protege esa llave |
| `VITE_API_URL` | `http://64.177.93.110:5000/api/positions` |
| `VITE_API_BASE_URL` | `http://64.177.93.110:5000` |
| `VITE_API_KEY` | La API key real |

> ⚠️ La llave privada de firma **nunca** debe subirse al repo. Guárdala en un lugar seguro (gestor de contraseñas) — si la pierdes, tendrás que generar una nueva y las apps ya instaladas dejarán de poder validar futuras actualizaciones hasta que las reinstalen.

> ⚠️ La API key queda embebida en el instalador que se publica en GitHub Releases (así funciona cualquier app de escritorio que llama a una API desde el cliente). Si el repositorio o los releases son públicos, cualquiera que descargue la app puede extraerla. Está bien para un grupo cerrado de amigos con su propio servidor; si eso cambia, conviene mover las llamadas a la API detrás de un backend propio.

## Ícono

El ícono (`src-tauri/icons/`) se generó a partir de `src-tauri/icons-src/icon-source.png` con:

```bash
npm run tauri icon src-tauri/icons-src/icon-source.png
```

Si quieres cambiarlo, reemplaza ese PNG (idealmente 1024×1024) y vuelve a correr el comando.
