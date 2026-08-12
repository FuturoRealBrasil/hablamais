import { normalize } from "./speech";

export type PhonemeDrill = {
  id: string;
  symbol: string;
  title: string;
  tipPt: string;
  contrastPt: string;
  words: string[];
  phrases: string[];
};

export const PHONEME_DRILLS: PhonemeDrill[] = [
  {
    id: "r",
    symbol: "R",
    title: "R simples (entre vogais)",
    tipPt: "O R no meio da palavra é um toque rápido da língua, como o R de 'caro' em português. Nunca é o R gutural de 'rato'.",
    contrastPt: "PT 'para' ≈ ES 'para' — mas em espanhol o toque é mais seco e curto.",
    words: ["pero", "caro", "mira", "hora", "ahora", "cara", "puerta", "pared"],
    phrases: ["Quiero comprar una cara pulsera.", "Mira la hora, ya es muy tarde."],
  },
  {
    id: "rr",
    symbol: "RR",
    title: "RR vibrante múltipla",
    tipPt: "Vibre a ponta da língua atrás dos dentes superiores, várias batidas seguidas. Também vale para R no início de palavra.",
    contrastPt: "Brasileiro tende a usar o R gutural (rato). Em espanhol isso soa como 'jato' — muda a palavra.",
    words: ["perro", "carro", "rojo", "rápido", "arriba", "guitarra", "correr", "ferrocarril"],
    phrases: ["El perro corre rápido por el barrio.", "El carro rojo está arriba de la torre."],
  },
  {
    id: "j",
    symbol: "J / G(e,i)",
    title: "Jota gutural",
    tipPt: "Som raspado na garganta, parecido com o RR carioca de 'carro'. Vale para J sempre e para G antes de E/I.",
    contrastPt: "PT 'janela' (som de J brando) ≠ ES 'jamón' (som raspado, tipo 'hamón').",
    words: ["jamón", "trabajo", "hijo", "mujer", "gente", "girar", "jugar", "ojo"],
    phrases: ["Mi hijo trabaja con gente muy joven.", "La mujer dejó el jamón en la mesa."],
  },
  {
    id: "ll",
    symbol: "LL / Y",
    title: "LL e Y",
    tipPt: "Na América Latina soa como 'j' de 'jeito' ou 'i' forte; no rioplatense soa 'sh'. Nunca separe 'l-l'.",
    contrastPt: "PT 'lh' de 'milho' é parecido, mas na Espanha o LL é mais próximo de 'lhi'.",
    words: ["llave", "calle", "pollo", "ella", "lluvia", "yo", "ayer", "silla"],
    phrases: ["Ella dejó la llave en la calle.", "Ayer comí pollo con lluvia afuera."],
  },
  {
    id: "n",
    symbol: "Ñ",
    title: "Eñe",
    tipPt: "Igual ao 'nh' português: língua no céu da boca. 'Año' = 'anho'.",
    contrastPt: "Cuidado: 'ano' (sem til) significa ânus. 'Año' é ano!",
    words: ["año", "niño", "señor", "mañana", "España", "pequeño", "sueño", "compañero"],
    phrases: ["El niño pequeño sueña con España.", "Mañana el señor cumple treinta años."],
  },
  {
    id: "bv",
    symbol: "B / V",
    title: "B e V têm o MESMO som",
    tipPt: "Em espanhol B e V soam iguais: um B suave. Nunca use o V labiodental do português.",
    contrastPt: "PT 'vaca' (dentes no lábio) ≠ ES 'vaca' (soa 'baca').",
    words: ["vaca", "beber", "vivir", "vino", "bueno", "trabajo", "nube", "volver"],
    phrases: ["Vamos a beber un buen vino.", "Voy a volver a vivir en Bolivia."],
  },
  {
    id: "d",
    symbol: "D",
    title: "D suave (nunca 'dji')",
    tipPt: "Entre vogais e no fim de palavra o D é suave, quase como o 'th' de 'the'. 'Ciudad' termina quase mudo.",
    contrastPt: "PT 'dia' vira 'djia'. Em espanhol 'día' é D puro, sem chiado.",
    words: ["día", "nada", "ciudad", "verdad", "todo", "adiós", "usted", "cansado"],
    phrases: ["Todo el día caminé por la ciudad.", "La verdad es que usted está cansado."],
  },
  {
    id: "g",
    symbol: "G (a,o,u) / GUE",
    title: "G duro e GUE/GUI",
    tipPt: "G antes de A, O, U é duro como 'gato'. Em GUE/GUI o U é mudo; só soa com trema: 'pingüino'.",
    contrastPt: "PT 'gente' (som de j) ≠ ES 'gente' (som de jota raspada) — mas 'gato' é igual.",
    words: ["gato", "guerra", "guitarra", "amigo", "agua", "guisante", "pingüino", "lengua"],
    phrases: ["Mi amigo toca la guitarra con agua al lado.", "El gato bebe agua junto al pingüino."],
  },
];

export type PronunciationResult = {
  score: number;
  heard: string;
  expected: string;
  words: { word: string; ok: boolean }[];
  weakWords: string[];
};

function levenshtein(a: string, b: string) {
  const m = a.length;
  const n = b.length;
  const prev = new Array<number>(n + 1);
  const cur = new Array<number>(n + 1);
  for (let j = 0; j <= n; j += 1) prev[j] = j;
  for (let i = 1; i <= m; i += 1) {
    cur[0] = i;
    for (let j = 1; j <= n; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min((cur[j - 1] ?? 0) + 1, (prev[j] ?? 0) + 1, (prev[j - 1] ?? 0) + cost);
    }
    for (let j = 0; j <= n; j += 1) prev[j] = cur[j] ?? 0;
  }
  return prev[n] ?? 0;
}

export function similarity(a: string, b: string) {
  if (!a && !b) return 1;
  const dist = levenshtein(a, b);
  return Math.max(0, 1 - dist / Math.max(a.length, b.length, 1));
}

export function scorePronunciation(expected: string, heard: string): PronunciationResult {
  const expWords = normalize(expected).split(" ").filter(Boolean);
  const heardWords = normalize(heard).split(" ").filter(Boolean);
  const pool = [...heardWords];

  const words = expWords.map((word) => {
    let bestIndex = -1;
    let best = 0;
    pool.forEach((h, i) => {
      const s = similarity(word, h);
      if (s > best) {
        best = s;
        bestIndex = i;
      }
    });
    const ok = best >= 0.8;
    if (ok && bestIndex >= 0) pool.splice(bestIndex, 1);
    return { word, ok };
  });

  const wordScore = words.length ? words.filter((w) => w.ok).length / words.length : 0;
  const globalScore = similarity(normalize(expected), normalize(heard));
  const score = Math.round((wordScore * 0.7 + globalScore * 0.3) * 100);

  return {
    score,
    heard: heard.trim(),
    expected,
    words,
    weakWords: words.filter((w) => !w.ok).map((w) => w.word),
  };
}

export function feedbackFor(score: number) {
  if (score >= 90) return { label: "Excelente", tone: "text-emerald-600", tipPt: "Pronúncia muito próxima do nativo. Siga para a próxima frase." };
  if (score >= 75) return { label: "Bom", tone: "text-primary", tipPt: "Quase lá! Repita focando nas palavras marcadas em vermelho." };
  if (score >= 50) return { label: "Regular", tone: "text-amber-600", tipPt: "Ouça o áudio modelo, repita devagar e grave outra vez." };
  return { label: "Precisa treinar", tone: "text-destructive", tipPt: "Fale mais alto e devagar, separando cada sílaba. Use o botão de áudio como modelo." };
}
