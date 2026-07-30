export type ChatMessage = {
  id: string;
  from: "bot" | "user";
  text: string;
  at: string;
};

export type ChatThread = {
  id: string;
  title: string;
  subtitle: string;
  preview: string;
  time: string;
  unread: number;
  avatarLabel: string;
  /** Lucide icon key for list avatar */
  avatarTone: "support" | "faq" | "feedback";
};

export type ChatPersistedState = {
  threads: ChatThread[];
  messagesByThread: Record<string, ChatMessage[]>;
};

/** Contexto opcional para personalizar respuestas (p. ej. último pedido). */
export type AutoReplyContext = {
  latestOrder?: { id: string; statusLabel: string } | null;
};

export const chatThreads: ChatThread[] = [
  {
    id: "1",
    title: "Soporte Rizoma",
    subtitle: "Equipo de ayuda",
    preview: "¿En qué podemos ayudarte hoy?",
    time: "Ahora",
    unread: 2,
    avatarLabel: "SR",
    avatarTone: "support",
  },
  {
    id: "2",
    title: "Plantas bot",
    subtitle: "Cuidados y tips",
    preview: "Pregúntame por luz, riego o pet-friendly.",
    time: "Ayer",
    unread: 0,
    avatarLabel: "PB",
    avatarTone: "faq",
  },
  {
    id: "3",
    title: "Feedback",
    subtitle: "Tu opinión",
    preview: "Cuéntanos tu experiencia con Rizoma.",
    time: "Lun",
    unread: 1,
    avatarLabel: "FB",
    avatarTone: "feedback",
  },
];

type SeedKey = "1" | "2" | "3";

export const threadSeeds: Record<
  SeedKey,
  { title: string; subtitle: string; seed: string[] }
> = {
  "1": {
    title: "Soporte Rizoma",
    subtitle: "Respuesta en minutos",
    seed: [
      "Hola, soy el equipo de Soporte Rizoma. ¿En qué podemos ayudarte hoy?",
      "Puedes preguntar por pedidos, envíos, cuidados o devoluciones.",
    ],
  },
  "2": {
    title: "Plantas bot",
    subtitle: "Tips de cuidado",
    seed: [
      "Soy el bot de cuidados de Rizoma. Pregúntame por luz, riego o mascotas.",
      "También puedo orientarte sobre plantas de interior o de sombra.",
    ],
  },
  "3": {
    title: "Feedback",
    subtitle: "Escuchamos ideas",
    seed: [
      "Gracias por tomarte un minuto. ¿Qué te ha parecido el catálogo Rizoma?",
      "Tu feedback nos ayuda a pulir la experiencia.",
    ],
  },
};

const supportWelcomeVariants: string[][] = [
  [
    "¡Hola! Bienvenido/a a Soporte Rizoma. Estamos aquí para echarte una mano.",
    "Puedes preguntar por pedidos, envíos, pagos, cuidados o devoluciones.",
  ],
  [
    "Hola de nuevo — equipo Rizoma al habla. ¿Qué necesitas hoy?",
    "Tip: en Mis pedidos verás el seguimiento al detalle si ya tienes un envío.",
  ],
  [
    "¡Ey! Soy Soporte Rizoma. Cuéntame qué te frena y lo resolvemos.",
    "También puedo orientarte con riego, luz o plantas pet-friendly.",
  ],
  [
    "Hola, gracias por escribirnos. ¿En qué te ayudamos?",
    "Horarios, pagos, envíos o una planta que no acaba de adaptarse: aquí estamos.",
  ],
];

export const quickSuggestions = [
  "Estado de mi pedido",
  "Cuidados de plantas",
  "Devoluciones",
  "Horarios de envío",
  "Métodos de pago",
  "Planta pet-friendly",
  "Problema con el riego",
] as const;

/** Contadores por intención para rotar plantillas sin repetir el mismo texto seguido. */
const replyCursors: Record<string, number> = {};

function pickTemplate(key: string, templates: string[]): string {
  if (templates.length === 0) return "";
  const cursor = replyCursors[key] ?? 0;
  const next = templates[cursor % templates.length];
  replyCursors[key] = cursor + 1;
  return next;
}

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function isSeedKey(threadId: string): threadId is SeedKey {
  return threadId === "1" || threadId === "2" || threadId === "3";
}

export function seedMessagesForThread(threadId: string): ChatMessage[] {
  const key: SeedKey = isSeedKey(threadId) ? threadId : "1";
  return threadSeeds[key].seed.map((text, index) => ({
    id: `seed-${key}-${index}`,
    from: "bot" as const,
    text,
    at: "Ahora",
  }));
}

/** Mensajes de bienvenida frescos para un chat de soporte nuevo. */
export function supportWelcomeMessages(threadId: string): ChatMessage[] {
  const cursor = replyCursors.welcome ?? 0;
  const lines = supportWelcomeVariants[cursor % supportWelcomeVariants.length];
  replyCursors.welcome = cursor + 1;
  return lines.map((text, index) => ({
    id: `welcome-${threadId}-${index}`,
    from: "bot" as const,
    text,
    at: "Ahora",
  }));
}

/** Crea hilo + mensajes de bienvenida para un chat de soporte nuevo. */
export function createSupportChatBundle(
  id: string,
  timeLabel: string,
): { thread: ChatThread; messages: ChatMessage[] } {
  const messages = supportWelcomeMessages(id);
  const last = messages[messages.length - 1]?.text ?? "¿En qué podemos ayudarte?";
  return {
    thread: {
      id,
      title: "Soporte Rizoma",
      subtitle: "Respuesta en minutos",
      preview: last,
      time: timeLabel,
      unread: 0,
      avatarLabel: "SR",
      avatarTone: "support",
    },
    messages,
  };
}

export function buildInitialChatState(): ChatPersistedState {
  const messagesByThread: Record<string, ChatMessage[]> = {};
  for (const thread of chatThreads) {
    messagesByThread[thread.id] = seedMessagesForThread(thread.id);
  }
  return {
    threads: chatThreads.map((thread) => ({ ...thread })),
    messagesByThread,
  };
}

const orderTemplates = [
  "Puedes seguir el envío en Mis pedidos (pestaña Perfil o acceso rápido). Abre el pedido RZ-… y verás cada paso: preparado → enviado → en camino → entregado.",
  "Para el estado del envío: ve a Mis pedidos, toca el pedido y revisa la barra de seguimiento. Si algo no cuadra con la fecha estimada, responde aquí con el número RZ-…",
  "En Mis pedidos tienes el historial completo. Si me dices el número (RZ-…) o abres ese pedido, el seguimiento queda más claro.",
];

const shippingTemplates = [
  "Envío estándar suele tardar 2–4 días laborables; express 24–48 h según zona. El detalle exacto aparece en Mis pedidos cuando el paquete sale del vivero.",
  "Cuando marcamos «Enviado», el tracking se actualiza en Mis pedidos. Si lleva más de 48 h sin moverse en «En camino», escríbenos con el RZ-… y lo revisamos.",
  "Consejo: guarda el número RZ-… del correo/confirmación. Con él localizas el envío al instante en Mis pedidos.",
];

const returnsTemplates = [
  "Devoluciones: 14 días si la planta llega dañada o no coincide con el pedido. Envíanos fotos claras + número RZ-… y te guiamos con la recogida o el reembolso.",
  "Si llega en mal estado: 1) fotos del embalaje y de la planta, 2) número de pedido, 3) descríbenos el problema aquí. En 14 días abrimos la devolución sin líos.",
  "Para reembolsos o cambios, necesitamos el RZ-… y evidencia (fotos). Empieza por Mis pedidos → el pedido afectado → y cuéntanos qué falló.",
];

const hoursTemplates = [
  "Atención en chat: de lunes a viernes, aprox. 9:00–18:00 (península). Fuera de horario dejamos respuesta; los envíos siguen saliendo según el calendario del vivero.",
  "El equipo humano revisa mensajes en horario laboral (L–V). Los envíos express tienen corte a media mañana: si pides después, suele salir al día siguiente.",
  "Puedes escribir cuando quieras; respondemos en minutos en horario de oficina. Los sábados/festivos priorizamos urgencias de pedidos ya en tránsito.",
];

const paymentTemplates = [
  "Aceptamos tarjeta, Apple Pay, Google Pay y pago contra reembolso (COD) según disponibilidad en checkout. El método queda guardado en el resumen del pedido.",
  "Si un pago no confirma: revisa el banco/Apple Pay y vuelve a Mis pedidos. Si el cobro aparece pero no el pedido, mándanos la hora aproximada y te lo localizamos.",
  "En checkout eliges el método antes de confirmar. Contra reembolso puede sumar un pequeño coste según zona; tarjeta y wallets no suelen añadir comisión extra en Rizoma.",
];

const greetingTemplates = [
  "¡Hola! ¿Pedidos, cuidados, pagos o devoluciones? Dime por dónde empezamos.",
  "¡Buenas! Estoy listo/a para ayudarte. Prueba también las sugerencias de abajo si te viene bien.",
  "¡Hey! Cuéntame en una frase qué necesitas y te oriento paso a paso.",
];

const thanksTemplates = [
  "¡De nada! Si surge otra duda (pedido, riego, devolución…), aquí seguimos.",
  "Encantados de ayudar. Cuando quieras, abre Mis pedidos o vuelve a escribirnos.",
  "¡A ti! Que tus plantas se pongan preciosas. Si no, ya sabes dónde estamos.",
];

const careWaterTemplates = [
  "Riego: deja secar la capa superior del sustrato antes de volver a regar. Mejor poco y frecuente que un charco. Escurre bien la maceta; el agua estancada pudre raíces.",
  "Tip riego: mete el dedo 2 cm en la tierra. Si sigue húmeda, espera. En invierno riega menos; en verano un poco más, siempre sin inundar.",
  "Si las hojas amarillean por abajo, a menudo es exceso de agua. Reduce riegos, mejora el drenaje y revisa que el platito no acumule agua.",
];

const careLightTemplates = [
  "Luz: la mayoría de interiores quieren luz brillante indirecta. Evita sol de mediodía pegado al cristal; una cortina fina suele bastar.",
  "Si la planta se estira hacia la ventana, necesita más luz. Gírala cada semana para un crecimiento equilibrado.",
  "Sombra / poca luz: elige especies de interior resistentes (en el catálogo filtra por luz). No todas aguantan un rincón oscuro.",
];

const carePetTemplates = [
  "Pet-friendly: en cada ficha verás si es segura para mascotas. Si convives con gatos/perros, filtra o pregunta por el nombre de la planta y te orientamos.",
  "Algunas clásicas (pothos, montera, etc.) pueden ser tóxicas si se mastican. Mira el badge pet-friendly en la ficha antes de comprar.",
  "Si ya tienes la planta y hay mascotas: colócala fuera de alcance o elige alternativas seguras del catálogo. ¿Me dices el nombre?",
];

const careGenericTemplates = [
  "En cada ficha Rizoma verás luz, riego y pet-friendly. Regla rápida: sustrato que seque entre riegos + luz indirecta + sin corrientes fuertes.",
  "Cuidados express: 1) lee luz/riego en la ficha, 2) no dejes agua en el plato, 3) limpia polvo de las hojas. Si me das el nombre, afino el tip.",
  "¿Hojas caídas, manchas o crecimiento raro? Dime síntomas + nombre de la planta (o abre su ficha) y te doy pasos concretos.",
];

const plantBotGeneric = [
  "Tip Rizoma: revisa luz / riego / pet-friendly en la ficha. Si me dices el nombre de la planta, te doy una orientación rápida.",
  "Puedo ayudarte con riego, luz o mascotas. ¿Qué especie tienes en mente?",
  "Prueba a preguntarme «riego montera» o «¿es pet-friendly?» — cuanto más concreto, mejor el tip.",
];

const feedbackGeneric = [
  "¡Gracias por compartirlo! Lo anotamos para mejorar catálogo y app. ¿Hay algo concreto que cambiarías?",
  "Tu feedback cuenta. ¿Fue por búsqueda, checkout, cuidados o envíos? Cuéntanos el detalle.",
  "Genial, lo pasamos al equipo. Si quieres, sugiere una planta o filtro que eches en falta.",
];

const genericTemplates = [
  "Gracias por tu mensaje. Mientras un especialista revisaría el caso en la versión completa, puedes: abrir Mis pedidos, mirar la ficha de la planta o usar las sugerencias rápidas.",
  "No estoy seguro/a de pillar exactamente lo que necesitas. ¿Es sobre un pedido, un pago, un envío o el cuidado de una planta? Con eso te doy pasos claros.",
  "Prueba con: estado del pedido, devoluciones, horarios, pago o un tip de riego/luz. También puedes ir a Mis pedidos desde el acceso rápido de arriba.",
];

function replyForCare(q: string): string {
  if (q.includes("riego") || q.includes("agua") || q.includes("regar")) {
    return pickTemplate("care-water", careWaterTemplates);
  }
  if (q.includes("luz") || q.includes("sol") || q.includes("sombra")) {
    return pickTemplate("care-light", careLightTemplates);
  }
  if (q.includes("mascota") || q.includes("pet") || q.includes("gato") || q.includes("perro")) {
    return pickTemplate("care-pet", carePetTemplates);
  }
  return pickTemplate("care-generic", careGenericTemplates);
}

/** Respuesta automática mock según el mensaje del usuario. */
export function autoReplyFor(
  text: string,
  threadId: string,
  ctx?: AutoReplyContext,
): string {
  const q = normalize(text);

  if (q.includes("pedido") || q.includes("seguimiento") || q.includes("tracking")) {
    const order = ctx?.latestOrder;
    if (order) {
      return pickTemplate("order-personal", [
        `Tu pedido más reciente es ${order.id} (${order.statusLabel}). Ábrelo en Mis pedidos para el seguimiento paso a paso. Si es otro RZ-…, dímelo y te oriento.`,
        `Veo el pedido ${order.id} en estado «${order.statusLabel}». En Mis pedidos tienes la barra completa. ¿Es ese el que te preocupa o hay otro?`,
        `Para ${order.id} el estado actual es ${order.statusLabel}. Si no coincide con lo que esperabas, responde con fotos o la fecha de compra y lo revisamos.`,
      ]);
    }
    return pickTemplate("order", orderTemplates);
  }

  if (
    q.includes("horario") ||
    q.includes("abierto") ||
    q.includes("atencion") ||
    q.includes("oficina")
  ) {
    return pickTemplate("hours", hoursTemplates);
  }

  if (q.includes("envio") || q.includes("entrega") || q.includes("paquete") || q.includes("transporte")) {
    return pickTemplate("shipping", shippingTemplates);
  }

  if (q.includes("devolucion") || q.includes("devolver") || q.includes("reembolso") || q.includes("cambio")) {
    return pickTemplate("returns", returnsTemplates);
  }

  if (
    q.includes("pago") ||
    q.includes("pagar") ||
    q.includes("tarjeta") ||
    q.includes("apple pay") ||
    q.includes("google pay") ||
    q.includes("contra reembolso") ||
    q.includes("metodo de pago")
  ) {
    return pickTemplate("payment", paymentTemplates);
  }

  if (
    q.includes("cuidado") ||
    q.includes("riego") ||
    q.includes("luz") ||
    q.includes("planta") ||
    q.includes("mascota") ||
    q.includes("pet") ||
    q.includes("hoja") ||
    q.includes("sustrato")
  ) {
    return replyForCare(q);
  }

  if (q.includes("hola") || q.includes("buenas") || q.includes("hey") || q.includes("buenos")) {
    return pickTemplate("greeting", greetingTemplates);
  }

  if (q.includes("gracias") || q.includes("genial") || q.includes("perfecto")) {
    return pickTemplate("thanks", thanksTemplates);
  }

  if (threadId === "2" || threadId.startsWith("faq")) {
    return pickTemplate("plant-bot", plantBotGeneric);
  }
  if (threadId === "3" || threadId.startsWith("feedback")) {
    return pickTemplate("feedback", feedbackGeneric);
  }

  return pickTemplate("generic", genericTemplates);
}
