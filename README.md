# Rizoma

Aplicacion movil multiplataforma (Expo + React Native) enfocada en un e-commerce boutique de plantas premium para hogares urbanos.

## Stack

- Expo (Managed Workflow) + React Native + TypeScript estricto
- Expo Router para navegacion file-based
- NativeWind para estilos
- React Native Reanimated para motion
- Lucide React Native para iconografia
- Jest para base de tests

## Estructura

- `app/`: rutas y pantallas
- `src/components/`: componentes UI y de catalogo
- `src/data/`: datos iniciales mock de productos
- `src/store/`: estado inicial y helpers de compra
- `src/theme/`: tokens visuales
- `src/types/`: modelos tipados de dominio

## Pantallas iniciales

- Home editorial (`/`)
- Catalogo con filtros (`/explore`)
- Detalle de planta (`/plants/[id]`)
- Favoritos (`/wishlist`)
- Carrito (`/cart`)
- Escaneo conceptual (`/scan`)

## Scripts

- `npm run start`
- `npm run android`
- `npm run ios`
- `npm run web`
- `npm run test`

## Objetivo del roadmap

Completar una app visualmente premium, funcional y testeada en una evolucion progresiva hasta alcanzar el alcance final del portfolio.
