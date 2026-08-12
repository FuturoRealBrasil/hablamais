export type VocabWord = {
  id: string;
  es: string;
  pt: string;
  phonetic: string;
  emoji: string;
  category: string;
  level: "A1" | "A2" | "B1" | "B2";
  example: string;
  examplePt: string;
  context: string;
};

export const VOCAB: VocabWord[] = [
  { id: "v1", es: "el desayuno", pt: "o café da manhã", phonetic: "de-sa-IÚ-no", emoji: "🥐", category: "Comida", level: "A1", example: "El desayuno está listo.", examplePt: "O café da manhã está pronto.", context: "No hotel: «¿A qué hora sirven el desayuno?»" },
  { id: "v2", es: "la mesa", pt: "a mesa", phonetic: "MÊ-sa", emoji: "🍽️", category: "Restaurante", level: "A1", example: "Una mesa para dos, por favor.", examplePt: "Uma mesa para dois, por favor.", context: "Ao chegar no restaurante." },
  { id: "v3", es: "la cuenta", pt: "a conta", phonetic: "KUÊN-ta", emoji: "🧾", category: "Restaurante", level: "A1", example: "La cuenta, por favor.", examplePt: "A conta, por favor.", context: "Ao terminar de comer." },
  { id: "v4", es: "el equipaje", pt: "a bagagem", phonetic: "e-ki-PÁ-rre", emoji: "🧳", category: "Viagem", level: "A2", example: "Mi equipaje no llegó.", examplePt: "Minha bagagem não chegou.", context: "No aeroporto, no balcão da companhia." },
  { id: "v5", es: "el aeropuerto", pt: "o aeroporto", phonetic: "a-e-ro-PUÊR-to", emoji: "✈️", category: "Viagem", level: "A1", example: "Voy al aeropuerto en taxi.", examplePt: "Vou ao aeroporto de táxi.", context: "Planejando o traslado." },
  { id: "v6", es: "la llave", pt: "a chave", phonetic: "IÁ-ve", emoji: "🔑", category: "Hotel", level: "A1", example: "Perdí la llave de la habitación.", examplePt: "Perdi a chave do quarto.", context: "Na recepção do hotel." },
  { id: "v7", es: "la habitación", pt: "o quarto", phonetic: "a-bi-ta-SSI-ON", emoji: "🛏️", category: "Hotel", level: "A1", example: "Quiero una habitación doble.", examplePt: "Quero um quarto de casal.", context: "Fazendo o check-in." },
  { id: "v8", es: "el trabajo", pt: "o trabalho", phonetic: "tra-BÁ-rro", emoji: "💼", category: "Trabalho", level: "A1", example: "Me gusta mucho mi trabajo.", examplePt: "Gosto muito do meu trabalho.", context: "Apresentando-se numa reunião." },
  { id: "v9", es: "la reunión", pt: "a reunião", phonetic: "rreu-NI-ON", emoji: "📅", category: "Trabalho", level: "A2", example: "La reunión empieza a las nueve.", examplePt: "A reunião começa às nove.", context: "Combinando horários no escritório." },
  { id: "v10", es: "el plazo", pt: "o prazo", phonetic: "PLÁ-sso", emoji: "⏳", category: "Trabalho", level: "B1", example: "Tenemos que cumplir el plazo.", examplePt: "Temos que cumprir o prazo.", context: "Falando de entregas de projeto." },
  { id: "v11", es: "el pueblo", pt: "o povoado / o povo", phonetic: "PUÊ-blo", emoji: "🏘️", category: "Lugares", level: "A2", example: "Mi abuela vive en un pueblo pequeño.", examplePt: "Minha avó mora num povoado pequeno.", context: "Falando de origem." },
  { id: "v12", es: "el coche / el carro", pt: "o carro", phonetic: "KÔ-tche", emoji: "🚗", category: "Transporte", level: "A1", example: "Vamos en coche a la playa.", examplePt: "Vamos de carro à praia.", context: "Espanha usa 'coche'; América Latina, 'carro'." },
  { id: "v13", es: "la tarjeta", pt: "o cartão", phonetic: "tar-RRÊ-ta", emoji: "💳", category: "Compras", level: "A1", example: "¿Puedo pagar con tarjeta?", examplePt: "Posso pagar com cartão?", context: "Na hora de pagar." },
  { id: "v14", es: "la tienda", pt: "a loja", phonetic: "TIÊN-da", emoji: "🏬", category: "Compras", level: "A1", example: "La tienda cierra a las ocho.", examplePt: "A loja fecha às oito.", context: "Perguntando horários." },
  { id: "v15", es: "el médico", pt: "o médico", phonetic: "MÊ-di-ko", emoji: "🩺", category: "Saúde", level: "A2", example: "Necesito ver a un médico.", examplePt: "Preciso ver um médico.", context: "Em uma emergência de viagem." },
  { id: "v16", es: "la receta", pt: "a receita (médica)", phonetic: "rre-SSÊ-ta", emoji: "💊", category: "Saúde", level: "B1", example: "El médico me dio una receta.", examplePt: "O médico me deu uma receita.", context: "Na farmácia." },
  { id: "v17", es: "el desarrollo", pt: "o desenvolvimento", phonetic: "de-sa-RRÔ-io", emoji: "📈", category: "Acadêmico", level: "B2", example: "El desarrollo del proyecto fue rápido.", examplePt: "O desenvolvimento do projeto foi rápido.", context: "Apresentação profissional." },
  { id: "v18", es: "el desempeño", pt: "o desempenho", phonetic: "de-sem-PÊ-nho", emoji: "🎯", category: "Trabalho", level: "B2", example: "Su desempeño mejoró mucho.", examplePt: "Seu desempenho melhorou muito.", context: "Avaliação de equipe." },
  { id: "v19", es: "la ventana", pt: "a janela", phonetic: "ven-TÁ-na", emoji: "🪟", category: "Casa", level: "A1", example: "Abre la ventana, por favor.", examplePt: "Abra a janela, por favor.", context: "Em casa." },
  { id: "v20", es: "el zumo / el jugo", pt: "o suco", phonetic: "SSÚ-mo", emoji: "🧃", category: "Comida", level: "A1", example: "Un zumo de naranja, por favor.", examplePt: "Um suco de laranja, por favor.", context: "Espanha: 'zumo'. Latino: 'jugo'." },
  { id: "v21", es: "ahora mismo", pt: "agora mesmo", phonetic: "a-Ó-ra MÍS-mo", emoji: "⏱️", category: "Expressões", level: "A2", example: "Voy ahora mismo.", examplePt: "Vou agora mesmo.", context: "Respondendo com urgência." },
  { id: "v22", es: "de repente", pt: "de repente", phonetic: "de rre-PÊN-te", emoji: "⚡", category: "Expressões", level: "B1", example: "De repente empezó a llover.", examplePt: "De repente começou a chover.", context: "Contando uma história." },
  { id: "v23", es: "echar de menos", pt: "sentir falta / saudade", phonetic: "e-TCHAR de MÊ-nos", emoji: "💭", category: "Expressões", level: "B1", example: "Echo de menos a mi familia.", examplePt: "Sinto falta da minha família.", context: "Não existe 'saudade' em espanhol." },
  { id: "v24", es: "el pasillo", pt: "o corredor", phonetic: "pa-SÍ-io", emoji: "🚪", category: "Lugares", level: "A2", example: "El baño está al final del pasillo.", examplePt: "O banheiro fica no fim do corredor.", context: "Dando direções." },
];

export const VOCAB_CATEGORIES = Array.from(new Set(VOCAB.map((w) => w.category)));

// --- Repetição espaçada (SM-2 simplificado) ---
export type SrsCard = { ease: number; interval: number; due: string; reps: number; lapses: number };
export type SrsMap = Record<string, SrsCard>;

const dayMs = 86400000;
const iso = (d: Date) => d.toISOString().slice(0, 10);

export function reviewCard(card: SrsCard | undefined, quality: "esqueci" | "dificil" | "facil"): SrsCard {
  const base: SrsCard = card ?? { ease: 2.5, interval: 0, due: iso(new Date()), reps: 0, lapses: 0 };
  let { ease, interval, reps, lapses } = base;

  if (quality === "esqueci") {
    ease = Math.max(1.3, ease - 0.25);
    interval = 0;
    reps = 0;
    lapses += 1;
  } else if (quality === "dificil") {
    ease = Math.max(1.3, ease - 0.1);
    interval = interval === 0 ? 1 : Math.max(1, Math.round(interval * 1.2));
    reps += 1;
  } else {
    ease = Math.min(3, ease + 0.1);
    interval = interval === 0 ? 2 : Math.round(interval * ease);
    reps += 1;
  }

  return { ease, interval, reps, lapses, due: iso(new Date(Date.now() + Math.max(0, interval) * dayMs)) };
}

export function dueWords(srs: SrsMap, words: VocabWord[] = VOCAB) {
  const today = iso(new Date());
  const due = words.filter((w) => !srs[w.id] || (srs[w.id]?.due ?? today) <= today);
  return due.sort((a, b) => (srs[b.id]?.lapses ?? 0) - (srs[a.id]?.lapses ?? 0));
}

export function srsStats(srs: SrsMap) {
  const values = Object.values(srs);
  return {
    studied: values.length,
    mastered: values.filter((c) => c.interval >= 7).length,
    difficult: values.filter((c) => c.lapses >= 2 && c.interval < 7).length,
  };
}
