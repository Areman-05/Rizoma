# Rizoma

Descubre plantas, compra con claridad y cuida tu colección — de la bienvenida al pedido y a Mi Jardín, en un solo viaje.

Rizoma es una app móvil (Expo + React Native) para quienes quieren un compañero botánico sin ruido: explorar un catálogo premium, filtrar por luz y dificultad, completar un pedido con seguimiento tipo delivery y revisar favoritos, chat de soporte y un jardín local con recordatorios de riego. No es un feed social ni un panel de métricas vacías: une onboarding, descubrimiento, compra, perfil y cuidado en un mismo relato, con una interfaz moderna, legible y pensada para el uso diario.

## La idea en una frase

Llevar el pulso de tus plantas en un solo sitio: descubrir con intención, comprar con confianza, seguir el pedido y cuidar lo que ya es tuyo — sin mezclar tienda, wishlist y diario de riego por separado.

## Para quién es

- Quien quiere claridad al abrir la app: saludo, promos, categorías y acceso rápido a catálogo, Match y Scan desde el inicio.
- Quien compra con criterio: fichas con luz, riego, dificultad, reseñas y un dock limpio para añadir al carrito o a Mi Jardín.
- Quien valora honestidad en el prototipo: catálogo y pedidos viven en el dispositivo; el tracking de pedido avanza en demo para enseñar el flujo completo.
- Quien separa compra y cuidado: Carrito / Pedidos para el comercio; Mi Jardín para riego y colección viva.
- Quien cuida sus datos locales: sesión, carrito, favoritos, pedidos, chat y jardín en AsyncStorage; auth email local y Google Sign-In opcional.

## Qué hace la app (en lenguaje humano)

### Inicio (Dashboard)

Saludo personalizado, carrusel de promos, chips de categoría y secciones de plantas recomendadas. Accesos a búsqueda, notificaciones, Plant Match y escanear planta. Un toque en una tarjeta abre la ficha completa.

### Explorar / Catálogo

Lista virtualizada con búsqueda y filtros (luz, dificultad, pet-safe, categoría). Cada planta muestra imagen, precio, badges y favorito. El detalle explica cuidados, reseñas y productos relacionados; desde ahí puedes comprar o guardar en Mi Jardín.

### Carrito y checkout

Líneas editables, resumen con envío y CTA «Finalizar pedido». El checkout guía dirección y pago (flujo simulado), formatea caducidad de tarjeta y, al confirmar, crea un pedido y te lleva al seguimiento.

### Pedidos

Listado de pedidos y detalle con timeline tipo delivery: Preparando → Enviado → En reparto → Entregado. En demo, el estado puede auto-avanzar para mostrar el recorrido completo sin backend logístico.

### Favoritos

Wishlist en grid con los mismos criterios de ficha; empty state que empuja a explorar el catálogo.

### Chat

Hilos de soporte locales con respuestas demo. Lista de conversaciones y detalle por hilo; pensado para completar el viaje post-compra sin depender de un servidor.

### Mi Jardín

Colección viva en el dispositivo: cabecera con contadores, cards con estado de riego, chip Regar/OK, marcar como regada, ver ficha o quitar. Es el puente entre «compré» y «cuido».

### Perfil

Identidad Rizoma: avatar (presets o galería), nombre, accesos a pedidos, favoritos, jardín, notificaciones, Plant Match, Scan y sesión. Editar perfil abre un sheet que oculta la tab bar para no filtrar la navegación.

### Plant Match y Scan

Match recomienda plantas según preferencias de cuidado. Scan devuelve coincidencias del catálogo con confianza transparente — ambos son motores demo locales, no ML en la nube.

### Onboarding y auth

Tras registrarte (email o Google), la bienvenida presenta la marca y el producto. Sin sesión no se entra al shell; con sesión nueva se completa onboarding; luego Inicio. Splash de marca al arranque.

### Ajustes de notificaciones

Preferencias locales (pedidos, ofertas, catálogo, chat, riego). Copy explícito de alcance demo: no hay push remoto de producción cableado como servicio externo obligatorio.

## Por qué Rizoma y no “otra app de plantas”

- **Un solo viaje de usuario:** de «me registro» a «exploro», «compro», «sigo el pedido» y «cuido mi jardín» sin exportar el relato a otra herramienta.
- **Compra y cuidado con sentido:** comercio en tabs y checkout; Mi Jardín responde «¿cómo van las que ya son mías?». Misma marca, distinta pregunta.
- **Datos locales y flujo defendible:** catálogo embebido, persistencia versionada y gate de auth/onboarding testeable — prototipo serio, no pantalla suelta.
- **Experiencia cuidada:** splash botánico, tipografía Inter, tokens de color, empty states, skeletons, dock de detalle unificado y tracking de pedido legible.
- **Rendimiento como decisión de diseño:** catálogo y favoritos con FlatList; stack con `freezeOnBlur`; dependencias contenidas (sin backend pesado en el cliente) para mantener el proyecto liviano en dispositivos reales.

## UI y UX: diseño, flujo y patrones

Esta sección recoge la intención detrás de la interfaz — uno de los aspectos que más se ha querido destacar en el proyecto.

### Principio rector: claridad antes que espectáculo

Las apps de e-commerce de plantas suelen competir por collages, badges y métricas que impresionan en capturas pero cansan al quinto uso. Rizoma apuesta por legibilidad y ritmo: el usuario debe saber en dos segundos dónde está, qué puede comprar y qué necesita cuidado. La estética dialoga con referencias tipo Leafy / boutiques botánicas (aire, verde marca `#01B763`, fichas con jerarquía clara), adaptada a una app local y a un prototipo completo de punta a punta.

### Flujo de navegación

```
Splash → (Login | Registro) → Onboarding (si aplica) → Shell principal (5 tabs)
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    ▼                         ▼                         ▼
              Ficha planta                 Checkout → Pedido          Jardín / Match / Scan
              (+ Mi Jardín)                (desde Carrito)            (desde Inicio o Perfil)
```

- Auth y onboarding marcan la entrada: splash de marca y pantallas de cuenta separadas del shell.
- Shell principal (tabs): Inicio · Carrito · Favoritos · Chat · Perfil — Explore existe como ruta de catálogo sin saturar la bottom bar.
- Pantallas de detalle (planta, pedido, chat, jardín) comparten header con retroceso y patrones predecibles.
- Bottom bar con destinos fijos: puedes alternar entre «¿qué compro?» y «¿cómo va mi cuenta?» sin perder el hilo del producto.

### Separación compra vs cuidado

Fue una decisión explícita de UX, no solo de carpetas:

| Pregunta del usuario | Dónde vive | Por qué |
| --- | --- | --- |
| ¿Qué plantas me encajan y cuáles compro? | Inicio / Explorar / Ficha / Carrito | Descubrimiento y comercio |
| ¿Dónde está mi pedido? | Pedidos + timeline | Confianza post-compra |
| ¿Qué tengo que regar? | Mi Jardín | Colección y constancia |
| ¿Quién soy en Rizoma? | Perfil | Identidad, accesos y sesión |

### Patrones de interfaz

- **Ficha de planta con dock único:** cantidad + añadir + acción de jardín en una sola fila, sin texto suelto encima de la CTA.
- **Tarjetas de catálogo** con precio, descuento, favorito y badges — escaneo rápido en grid o carrusel.
- **Estados vacíos con copy útil:** carrito, favoritos, jardín y pedidos explican el siguiente paso.
- **Timeline de pedido** con etapas humanas (Preparando / Enviado / En reparto / Entregado).
- **Tipografía Inter escalonada:** títulos firmes, body legible, labels de cuidado en acento marca.
- **Sheet de editar perfil** que oculta la tab bar: el modal no compite visualmente con la navegación.

### Rendimiento y percepción de fluidez

Decisiones conscientes del prototipo:

- Listas largas de catálogo/favoritos con **FlatList**; home y carrito optimizados al tamaño demo del dataset.
- Persistencia con **timeout** si AsyncStorage se cuelga (emuladores), para no dejar pantallas eternas de carga.
- Splash de marca acotado; la app no monta el shell hasta completar la entrada de marca.
- Stack con **freezeOnBlur** para reducir trabajo en pantallas fuera de foco.
- Sin analytics SDK ni state managers pesados: menos ruido de red y de CPU en el cliente demo.

## Reflexión

El diseño de Rizoma no persigue “parecer pro” solo con efectos, sino sentirse fiable: un camino corto desde abrir la app hasta entender una planta, comprarla y cuidarla. La interfaz es parte del producto — no un envoltorio del repositorio — y por eso comparte peso con la arquitectura, la persistencia local y las pruebas en este proyecto.

## Cómo probarla en tu máquina

El núcleo funciona sin backend propio: catálogo, carrito, favoritos, pedidos, jardín, chat y cuentas email viven en el dispositivo. Google Sign-In es opcional y requiere clientes OAuth correctos si quieres probar ese flujo.

**Requisitos habituales:** Node.js LTS, npm, Expo Go (o build nativo) y, para Android, emulador/dispositivo con la app Expo.

```bash
npm install
npm run start
```

Luego abre en:

```bash
npm run android
# o
npm run ios
# o escanea el QR con Expo Go
```

### Google Sign-In (Expo Go)

En Google Cloud Console → cliente OAuth **tipo Web**, añade:

- `rizoma://`
- `rizoma://oauthredirect`
- El URI exacto que imprime Metro al abrir login en `__DEV__`

Client IDs: `.env` (`EXPO_PUBLIC_GOOGLE_*`) o fallbacks en `src/config/googleAuth.ts`.  
Nunca guardes el `client_secret` en la app.

## Tests automatizados

```bash
npm run typecheck
npm test
```

Los unitarios (Jest + `jest-expo`) cubren gate de auth/onboarding, carrito y persistencia shop, pricing/shipping, filtros de catálogo, labels de cuidado, pedidos tipados, userStore y validación de Google `id_token` (**11 suites · 36 tests**).

No hay suite E2E de UI cableada en CI en esta versión: la verificación de pantallas se apoya en typecheck, tests de dominio y QA manual del flujo completo.

## Detalle técnico (opcional)

Si te interesa el cómo está hecha:

| Área | Tecnología |
| --- | --- |
| UI | React Native 0.86, Expo 57, NativeWind 4, Lucide |
| Navegación | Expo Router (Stack + Tabs), `authGate` post-splash |
| Estado | React Context (Auth, Shop, Garden, Chat, Onboarding) |
| Datos | Catálogo local, AsyncStorage versionado |
| Auth | Email/contraseña local (hash), Google Sign-In (`expo-auth-session`) |
| Media | `expo-image-picker`, splash custom + `expo-splash-screen` |
| Tipografía | Inter (`@expo-google-fonts/inter`) |
| Tests | Jest, jest-expo, Testing Library (deps listas; cobertura actual en dominio) |

Estructura de carpetas resumida:

- `app/` — rutas y pantallas
- `src/components/` — UI, brand, auth, catálogo, pedidos, perfil
- `src/context/` — sesión Auth
- `src/navigation/` — reglas de gate
- `src/store/` — Shop, Garden, Chat, Onboarding + persistence
- `src/services/` — userStore, scan, plant match, Google token
- `src/data/` — plantas, categorías, chat seeds, onboarding
- `src/theme/` — palette, tokens, FontProvider/splash
- `src/utils/` — pricing, shipping, filtros, labels

**Versión actual de referencia:** 1.0.0 (`app.json`).

## Checklist QA visual

1. Splash → Login / Register → Onboarding → Inicio  
2. Catálogo / ficha — filtros, reseñas, carrito, Mi Jardín  
3. Carrito → Checkout → Pedido (timeline)  
4. Favoritos / Chat / Perfil (editar sin letras de tab bar)  
5. Mi Jardín / Match / Scan / Notificaciones  

---

**Rizoma:** del primer descubrimiento al pedido y al jardín, con compra y cuidado en un solo sitio.
