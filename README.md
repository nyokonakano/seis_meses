# 💌 Seis Meses — Guía de setup

Página web sorpresa para el aniversario de 6 meses.
Funciona en PC y móvil, no necesita servidor ni instalaciones.

---

## 📁 Estructura del proyecto

```
seis_meses/
├── index.html
├── css/
│   ├── style.css
│   ├── animations.css
│   └── responsive.css
├── js/
│   ├── app.js              ← orquestador principal
│   ├── stars.js            ← fondo estrellado
│   ├── password.js         ← pantalla de contraseña
│   ├── counter.js          ← contador de tiempo juntos
│   ├── album.js            ← galería con lightbox
│   ├── letters.js          ← estrellas interactivas
│   ├── puzzle.js           ← rompecabezas
│   ├── future-letters.js   ← cartas con fecha + contraseña
│   └── finale.js           ← partículas del final
├── data/
│   ├── thoughts.json       ← "Lo que nunca te dije"
│   └── love-reasons.json   ← "Cosas que amo de ti"
└── assets/
    ├── audio/
    │   └── cancion.mp3     ← su canción favorita
    ├── fotos/
    │   ├── foto1.jpg
    │   ├── foto2.jpg
    │   └── … (hasta foto10.jpg)
    └── puzzle/
        └── puzzle-image.jpg ← foto para el rompecabezas
```

---

## ✅ Checklist de personalización

### 1. Contraseña de entrada
Archivo: `js/password.js`
```
const CORRECT = '08022026';
```
→ Formato DDMMYYYY. Cámbiala si la fecha de inicio es diferente.

---

### 2. Fecha de inicio de la relación
Archivo: `js/counter.js`
```
const START_DATE  = new Date('2026-02-08T00:00:00');
const TARGET_DATE = new Date('2026-08-08T00:00:00');
```
→ `START_DATE` = día que empezaron.
→ `TARGET_DATE` = el hito de los 6 meses (se usa para la barra de progreso).

---

### 3. Fotos del álbum
Carpeta: `assets/fotos/`

Agrega tus fotos con estos nombres exactos:
```
foto1.jpg, foto2.jpg, foto3.jpg … foto10.jpg
```
Tamaño recomendado: **800×800 px** o similar (cuadradas quedan mejor).
Formato: JPG o PNG.

Cada foto tiene una descripción editable en `index.html`:
```html
<div class="photo-card">
  <img src="assets/fotos/foto1.jpg" alt="Recuerdo 01">
  <span>Aquí va tu descripción</span>  ← EDITA ESTE TEXTO
</div>
```

---

### 4. Historia / Timeline
Archivo: `index.html` → sección `#capituloTimeline`

Busca los comentarios `← CAMBIA la fecha` y `← DESCRIBE el momento`
y rellena cada bloque con sus momentos reales:
```html
<span class="timeline-date">Marzo, 2026</span>
<h4>Nuestra primera cita</h4>
<p>Fuimos a tomar café y hablamos hasta que cerraron el lugar.</p>
```
Puedes agregar más momentos copiando un bloque `.timeline-item` completo.

---

### 5. Carta de amor
Archivo: `index.html` → sección `#capituloLetter`

Busca los comentarios `← PERSONALIZA` y escribe tu carta real.
También cambia `[Tu nombre]` en la firma.

---

### 6. "Lo que nunca te dije"
Archivo: `data/thoughts.json`

Edita o agrega pensamientos cambiando el campo `"text"` de cada objeto:
```json
{
  "id": 1,
  "text": "Lo que nunca te dije es que..."
}
```
> ⚠️ Nota: los textos del JSON son de referencia para edición.
> Los que se muestran en pantalla están en `index.html` → `.thought-card`.
> Edita ambos si quieres que coincidan, o adapta `app.js` para cargar el JSON.

---

### 7. "Cosas que amo de ti" (estrellas)
Archivo: `index.html` → sección `#capituloStars`

Cada estrella tiene un atributo `data-love` con el texto que aparece al tocarla:
```html
<button class="love-star" data-love="Amo tus ojos porque...">⭐</button>
```
→ Cámbialo por tus razones reales y personales.

También puedes editarlas en `data/love-reasons.json` como referencia.

---

### 8. Cartas para el futuro
Archivo: `js/future-letters.js` → bloque `CARTAS ↓`

Cada carta tiene 4 campos:
```js
{
  title:      'Para dentro de un año',
  subtitle:   'Para leer juntos el 8 de febrero de 2027.',
  unlockDate: '2027-02-08',   // fecha en que se abre sola (YYYY-MM-DD)
  password:   'tucontraseña', // clave de acceso anticipado
  content:    `Tu carta aquí...`
}
```

**Lógica de apertura:**
| Situación | Qué pasa |
|-----------|----------|
| Fecha cumplida | Se abre con un clic |
| Antes de la fecha + contraseña correcta | Se abre |
| Antes de la fecha + contraseña incorrecta | Muestra error |
| Sin fecha y sin contraseña | Muestra "aún no es el momento" |

---

### 9. Canción de fondo
Archivo: `assets/audio/cancion.mp3`

Pon su canción favorita con ese nombre exacto.
Formatos compatibles: MP3, OGG, WAV.
→ El botón ♪ en la esquina inferior derecha la activa/pausa.

---

### 10. Foto del rompecabezas
Archivo: `assets/puzzle/puzzle-image.jpg`

Pon una foto especial de ustedes con ese nombre.
Tamaño recomendado: **480×480 px** (cuadrada).

---

### 11. Textos finales
Archivo: `index.html` → sección `#finalSection`

```html
<h1 class="final-title">❤️ Te amo, Elis ❤️</h1>
<p class="final-text">Tu mensaje final aquí...</p>
<div class="final-signature">Con amor, <em>[Tu nombre]</em></div>
```

---

## 🚀 Cómo abrirla

### Opción A — Directamente (sin servidor)
Abre `index.html` en cualquier navegador moderno.
Funciona offline una vez que los archivos están en su lugar.

> ⚠️ En algunos navegadores los archivos JSON y las imágenes locales
> pueden bloquearse por política CORS. Si pasa eso, usa la Opción B.

### Opción B — Con servidor local (recomendado)
Si tienes Node.js instalado:
```bash
npx serve .
```
O si tienes Python:
```bash
python -m http.server 8080
```
Luego abre `http://localhost:8080` en el navegador.

### Opción C — GitHub Pages (para compartir por link)
1. Sube el repo a GitHub
2. Ve a **Settings → Pages → Branch: main → Save**
3. En unos minutos tendrás un link público para compartirle

---

## 🎮 Easter Egg
En el teclado escribe: **↑ ↑ ↓ ↓ ← → ← → B A**
y disfruta la sorpresa. 🎉

---

## 💡 Tips finales

- **Fotos:** comprímelas antes de subirlas para que cargue rápido. Herramienta gratuita: [squoosh.app](https://squoosh.app)
- **Canción:** si el archivo es muy pesado (+5MB) puede tardar en cargar en móvil
- **Privacidad:** si usas GitHub Pages el repo debe ser público. Para mantenerlo privado usa Netlify o Vercel con deploy directo desde el repo privado
- **Prueba en móvil** antes del día especial para asegurarte que todo se ve bien

---

*Hecho con mucho amor. ❤️*