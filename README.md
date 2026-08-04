# Rizoma

App móvil (Expo + React Native + TypeScript) de e-commerce boutique de plantas premium.
Dirección visual inspirada en Leafy (Behance), con identidad propia Rizoma.

## Design system

- Brand: `#01B763`
- Tipografía: Inter
- Grid móvil: márgenes 13px, 4 columnas, gutter 12px
- Tabs: Inicio, Carrito, Favoritos, Chat, Perfil (catálogo en Explore, oculto del tab bar)

## Stack

- Expo Router 57, NativeWind, Lucide, Jest, AsyncStorage
- Auth local (email/password con hash) + Google Sign-In (`id_token`)

## Estructura

- `app/`: rutas y pantallas
- `src/components/`: UI, brand, auth, catálogo, perfil
- `src/context/`: sesión Auth
- `src/navigation/`: reglas de gate post-splash
- `src/store/`: Shop, Garden, Chat, Onboarding + persistence
- `src/services/`: userStore, scan, plant match
- `src/data/`: plantas mock, chat seeds, categorías
- `src/theme/`: tokens + FontProvider/splash
- `src/utils/`: pricing, shipping, filtros, labels

## Flujo de arranque

1. Splash de marca
2. Sesión abierta → home (o onboarding si la cuenta es nueva)
3. Sin sesión → login
4. Register → bienvenida → home
5. Login / Google → home (o bienvenida si aplica)

## Scripts

```bash
npm run start
npm run android
npm run ios
npm run test
npm run typecheck
```

## Google Sign-In (Expo Go)

En Google Cloud Console → cliente OAuth **tipo Web**, añade:

- `rizoma://`
- `rizoma://oauthredirect`
- El URI exacto que imprime Metro al abrir login en `__DEV__`

Client IDs: `.env` (`EXPO_PUBLIC_GOOGLE_*`) o fallbacks en `src/config/googleAuth.ts`.
Nunca guardes el `client_secret` en la app.

## Checklist QA visual

1. Inicio — saludo, promos, chips
2. Catálogo / ficha — filtros, reseñas, comprar
3. Carrito / Favoritos — totales, empty states
4. Checkout / Pedidos — pasos, cancelar, tracking
5. Chat / Scan / Jardín
6. Onboarding / Login / Register / Perfil
