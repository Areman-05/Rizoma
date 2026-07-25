# Rizoma

App movil (Expo + React Native + TypeScript) de e-commerce boutique de plantas premium.
Direccion visual inspirada en el proyecto Behance Leafy, con identidad propia Rizoma.

## Design system (Leafy-inspired)

- Brand: `#01B763`
- Red / Yellow / Black / White / Gray: `#EF4444` / `#F1B826` / `#2B2B2B` / `#FFFFFF` / `#EEF2F6`
- Tipografia: Inter (Headline 36/28, Body 24/16)
- Grid movil: margenes 13px, 4 columnas, gutter 12px
- Tabs: Inicio, Carrito, Favoritos, Chat, Perfil
- Flujos: checkout con pedidos persistidos, chat por hilo, onboarding primer arranque

## Stack

- Expo Router, NativeWind, Reanimated, Lucide, Jest (`@react-native/jest-preset`), AsyncStorage

## Estructura

- `app/`: rutas y pantallas (incl. `chat/[id]`)
- `src/components/`: UI y catalogo
- `src/data/`: plantas mock y categorias
- `src/store/`: carrito, wishlist, pedidos, jardin
- `src/services/`: scan y plant match
- `src/theme/`: tokens + FontProvider
- `src/utils/`: pricing, filtros, labels ES

## Scripts

- `npm run start` / `android` / `ios` / `web` / `test`

## Checklist de feedback visual (QA)

Probar en **emulador Android / Expo Go** (mejor que web) y comparar con capturas Leafy:

1. **Inicio** — saludo con nombre de perfil, campana con punto rojo, carrusel de promos, chips + grid
2. **Catálogo** — filtros ES, contador de plantas, empty state con icono
3. **Ficha planta** — margen 13px, reseñas, stepper cantidad, comprar ahora
4. **Carrito / Favoritos** — totales, toast al añadir todos, empty states brand
5. **Checkout** — “Finalizar compra”, Anterior entre pasos, éxito con volver al inicio
6. **Pedidos** — historial + cancelar
7. **Chat** — CTA soporte, burbujas, enviar con icono, escribiendo…
8. **Scan** — “Encuadra la planta”, overlay al escanear, resultados pulsables
9. **Onboarding** — iconos por slide, Saltar, dots Leafy
10. **Perfil / Login** — menú limpio, iniciar sesión vs invitado

## Nota

El diseño se itera hasta alcanzar nivel Behance. Feedback visual bienvenido en cada tanda.

## Flujos recientes

- Home scrollable con carrusel de promos y subtítulos de categoría
- Checkout con pasos atrás, pedidos cancelables y envío calculado
- Chat con timestamps e indicador “escribiendo…”
- Jardín con barra de riego y skeleton de carga
