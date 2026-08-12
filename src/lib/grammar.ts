export type GrammarExercise = {
  prompt: string;
  options: string[];
  answer: number;
  explainPt: string;
};

export type GrammarTopic = {
  id: string;
  level: "A1" | "A2" | "B1" | "B2";
  title: string;
  summaryPt: string;
  explanationPt: string[];
  examples: { es: string; pt: string }[];
  comparison: { pt: string; es: string; notePt: string }[];
  exercises: GrammarExercise[];
  test: GrammarExercise[];
  reviewPt: string[];
};

export const GRAMMAR_TOPICS: GrammarTopic[] = [
  {
    id: "tener-anos",
    level: "A1",
    title: "Idade: tener + años (erro clássico do brasileiro)",
    summaryPt: "Em espanhol a idade se diz com o verbo TENER, e a palavra é 'años' (com ñ).",
    explanationPt: [
      "Em português dizemos 'Eu tenho 20 anos' — em espanhol a estrutura é igual: «Tengo 20 años».",
      "O erro mais comum é escrever/falar 'ano' sem o til. 'Ano' em espanhol significa ânus; 'año' é ano.",
      "Para perguntar: «¿Cuántos años tienes?» (informal) ou «¿Cuántos años tiene usted?» (formal).",
    ],
    examples: [
      { es: "Tengo veinte años.", pt: "Tenho vinte anos." },
      { es: "¿Cuántos años tienes?", pt: "Quantos anos você tem?" },
      { es: "Mi hermana tiene treinta y dos años.", pt: "Minha irmã tem trinta e dois anos." },
    ],
    comparison: [
      { pt: "Eu tenho 20 anos.", es: "Tengo 20 años.", notePt: "Não use 'soy 20 años' (isso é influência do inglês)." },
      { pt: "Ela faz aniversário hoje.", es: "Ella cumple años hoy.", notePt: "'Cumplir años' = fazer aniversário." },
    ],
    exercises: [
      { prompt: "Complete: «Yo ___ 25 años».", options: ["soy", "tengo", "hago"], answer: 1, explainPt: "Idade sempre com TENER: «tengo 25 años»." },
      { prompt: "Qual está correto?", options: ["Tengo 30 anos.", "Tengo 30 años.", "Soy 30 años."], answer: 1, explainPt: "'Años' com ñ; 'anos' significa outra coisa bem diferente." },
    ],
    test: [
      { prompt: "Traduza: «Quantos anos você tem?»", options: ["¿Cuántos años tienes?", "¿Cuántos anos eres?", "¿Qué edad haces?"], answer: 0, explainPt: "Pergunta padrão com tener." },
      { prompt: "Complete: «Mi padre ___ sesenta años».", options: ["es", "hace", "tiene"], answer: 2, explainPt: "Terceira pessoa de tener: tiene." },
    ],
    reviewPt: ["Idade = tener + número + años", "Nunca esqueça o til do ñ", "Aniversário = cumplir años"],
  },
  {
    id: "ser-estar",
    level: "A1",
    title: "Ser x Estar",
    summaryPt: "SER para característica, identidade e origem; ESTAR para estado, lugar e situação temporária.",
    explanationPt: [
      "SER: identidade, profissão, origem, características permanentes. «Soy brasileño», «Es profesor».",
      "ESTAR: localização, estado físico/emocional, situações passageiras. «Estoy cansado», «El libro está en la mesa».",
      "Mudança de sentido: «Es aburrido» (é chato) x «Está aburrido» (está entediado).",
    ],
    examples: [
      { es: "Soy de Brasil, pero estoy en México.", pt: "Sou do Brasil, mas estou no México." },
      { es: "La sopa está fría.", pt: "A sopa está fria." },
      { es: "Ella es muy simpática.", pt: "Ela é muito simpática." },
    ],
    comparison: [
      { pt: "Estou com fome.", es: "Tengo hambre.", notePt: "Fome, sede, frio, calor, medo usam TENER, não estar." },
      { pt: "Estou com 30 anos.", es: "Tengo 30 años.", notePt: "Mesma lógica: tener." },
    ],
    exercises: [
      { prompt: "«El café ___ caliente».", options: ["es", "está"], answer: 1, explainPt: "Estado momentâneo → estar." },
      { prompt: "«Mi madre ___ médica».", options: ["es", "está"], answer: 0, explainPt: "Profissão/identidade → ser." },
    ],
    test: [
      { prompt: "«Nosotros ___ en la oficina».", options: ["somos", "estamos"], answer: 1, explainPt: "Localização → estar." },
      { prompt: "«Hoy ___ lunes».", options: ["es", "está"], answer: 0, explainPt: "Dias da semana usam ser." },
    ],
    reviewPt: ["Ser = essência", "Estar = estado e lugar", "Sensações físicas = tener"],
  },
  {
    id: "falsos-amigos",
    level: "A2",
    title: "Falsos cognatos (falsos amigos)",
    summaryPt: "Palavras que parecem português mas significam outra coisa — a maior armadilha para brasileiros.",
    explanationPt: [
      "«Embarazada» NÃO é envergonhada: significa grávida. Envergonhada = «avergonzada».",
      "«Exquisito» não é esquisito: significa delicioso/refinado. Esquisito = «raro, extraño».",
      "«Largo» significa comprido; largo (amplo) = «ancho».",
      "«Rato» é um momento de tempo; o animal é «ratón».",
      "«Oficina» é escritório; oficina mecânica = «taller».",
      "«Vaso» é copo; vaso de planta = «maceta».",
      "«Salada» significa salgada; salada = «ensalada».",
      "«Pelado» significa careca/descascado, e em vários países 'nu'.",
      "«Sobremesa» é a conversa depois da refeição; a sobremesa é «el postre».",
      "«Apellido» é sobrenome; apelido = «apodo».",
      "«Borracha» é bêbada; borracha de apagar = «goma».",
      "«Cachorro» é filhote; cachorro adulto = «perro».",
    ],
    examples: [
      { es: "Mi hermana está embarazada de cinco meses.", pt: "Minha irmã está grávida de cinco meses." },
      { es: "El postre estuvo exquisito.", pt: "A sobremesa estava deliciosa." },
      { es: "Trabajo en una oficina en el centro.", pt: "Trabalho num escritório no centro." },
    ],
    comparison: [
      { pt: "Fiquei com vergonha.", es: "Me dio vergüenza. / Me sentí avergonzado.", notePt: "Nunca «estoy embarazado»." },
      { pt: "Que comida esquisita!", es: "¡Qué comida más rara!", notePt: "'Exquisita' seria um elogio." },
      { pt: "Vou levar meu cachorro ao veterinário.", es: "Voy a llevar a mi perro al veterinario.", notePt: "'Cachorro' = filhote." },
    ],
    exercises: [
      { prompt: "«Ella está embarazada» significa:", options: ["Ela está envergonhada", "Ela está grávida", "Ela está cansada"], answer: 1, explainPt: "Embarazada = grávida." },
      { prompt: "Como dizer 'copo de água'?", options: ["Maceta de agua", "Vaso de agua", "Taza de agua"], answer: 1, explainPt: "Vaso = copo. Taza = xícara." },
    ],
    test: [
      { prompt: "«El postre estaba exquisito» quer dizer:", options: ["A sobremesa estava esquisita", "A sobremesa estava deliciosa"], answer: 1, explainPt: "Exquisito é elogio." },
      { prompt: "Sobrenome em espanhol é:", options: ["apodo", "apellido", "sobrenombre"], answer: 1, explainPt: "Apellido = sobrenome; apodo = apelido." },
    ],
    reviewPt: ["Embarazada = grávida", "Exquisito = delicioso", "Oficina = escritório", "Vaso = copo", "Apellido = sobrenome"],
  },
  {
    id: "gustar",
    level: "A2",
    title: "Verbo gustar e verbos invertidos",
    summaryPt: "Em espanhol quem 'gosta' é o objeto: «Me gusta el café» (o café me agrada).",
    explanationPt: [
      "A estrutura é: pronome (me, te, le, nos, os, les) + gusta/gustan + o que agrada.",
      "Singular: «Me gusta la música». Plural: «Me gustan las canciones».",
      "Nunca diga «Yo gusto de...». Use o mesmo padrão com encantar, doler, interesar, faltar.",
    ],
    examples: [
      { es: "Me gustan los libros de historia.", pt: "Gosto dos livros de história." },
      { es: "A ella le encanta bailar.", pt: "Ela adora dançar." },
      { es: "Me duele la cabeza.", pt: "Minha cabeça dói." },
    ],
    comparison: [
      { pt: "Eu gosto de você.", es: "Me gustas.", notePt: "Sem 'de' — quem agrada é o sujeito." },
      { pt: "Nós gostamos de viajar.", es: "Nos gusta viajar.", notePt: "Com verbo no infinitivo usa-se sempre 'gusta'." },
    ],
    exercises: [
      { prompt: "«A mí ___ los tacos».", options: ["me gusta", "me gustan", "yo gusto"], answer: 1, explainPt: "Plural (los tacos) → gustan." },
      { prompt: "«A nosotros ___ estudiar español».", options: ["nos gusta", "nos gustan"], answer: 0, explainPt: "Infinitivo → gusta." },
    ],
    test: [
      { prompt: "Traduza: «Ela gosta de mim».", options: ["Ella me gusta", "Yo le gusto", "Ella gusta de mí"], answer: 1, explainPt: "Se ela gosta de mim, eu sou quem agrada: «yo le gusto»." },
      { prompt: "«Me ___ la cabeza».", options: ["duele", "duelen"], answer: 0, explainPt: "La cabeza é singular." },
    ],
    reviewPt: ["me/te/le/nos/os/les + gusta(n)", "Infinitivo sempre com gusta", "Mesmo padrão: encantar, doler, interesar"],
  },
  {
    id: "muy-mucho",
    level: "A2",
    title: "Muy x Mucho e outros pares confusos",
    summaryPt: "MUY acompanha adjetivos e advérbios; MUCHO acompanha substantivos e verbos.",
    explanationPt: [
      "«Muy cansado», «muy rápido» (antes de adjetivo/advérbio).",
      "«Mucho trabajo», «como mucho» (com substantivo ou depois do verbo). Concorda: mucha, muchos, muchas.",
      "Outros pares: también/tampoco, pero/sino, por/para, hay/está.",
    ],
    examples: [
      { es: "Estoy muy cansado porque trabajé mucho.", pt: "Estou muito cansado porque trabalhei muito." },
      { es: "Hay muchas personas en la calle.", pt: "Há muitas pessoas na rua." },
      { es: "No es café, sino té.", pt: "Não é café, e sim chá." },
    ],
    comparison: [
      { pt: "Muito obrigado.", es: "Muchas gracias.", notePt: "Gracias é substantivo plural → muchas." },
      { pt: "Eu também não.", es: "Yo tampoco.", notePt: "Frase negativa usa tampoco, não 'también no'." },
    ],
    exercises: [
      { prompt: "«Ella es ___ inteligente».", options: ["muy", "mucho"], answer: 0, explainPt: "Antes de adjetivo → muy." },
      { prompt: "«Tengo ___ hambre».", options: ["muy", "mucha"], answer: 1, explainPt: "Hambre é substantivo feminino → mucha." },
    ],
    test: [
      { prompt: "«Trabajo ___ todos los días».", options: ["muy", "mucho"], answer: 1, explainPt: "Depois do verbo → mucho." },
      { prompt: "«No quiero agua, ___ jugo».", options: ["pero", "sino"], answer: 1, explainPt: "Correção/oposição depois de negativa → sino." },
    ],
    reviewPt: ["Muy + adjetivo/advérbio", "Mucho + substantivo/verbo (concorda)", "Negativa: tampoco / sino"],
  },
  {
    id: "preterito",
    level: "B1",
    title: "Pretérito indefinido x pretérito perfecto",
    summaryPt: "«Hablé» (ação concluída no passado) x «He hablado» (passado ligado ao presente, comum na Espanha).",
    explanationPt: [
      "Indefinido: ações terminadas com marcador de tempo fechado — ayer, la semana pasada, en 2020.",
      "Perfecto compuesto: hoy, esta semana, últimamente, ya, todavía no. Muito usado na Espanha; na América Latina o indefinido domina.",
      "Brasileiro tende a traduzir 'eu tenho falado' literalmente — em espanhol «he hablado» significa 'eu falei (hoje/recentemente)'.",
    ],
    examples: [
      { es: "Ayer hablé con mi jefe.", pt: "Ontem falei com meu chefe." },
      { es: "Hoy he hablado con mi jefe.", pt: "Hoje falei com meu chefe." },
      { es: "Nunca he estado en Perú.", pt: "Nunca estive no Peru." },
    ],
    comparison: [
      { pt: "Eu tenho estudado muito.", es: "He estudiado mucho. / Llevo estudiando mucho.", notePt: "Sentido de continuidade pede 'llevar + gerúndio'." },
      { pt: "Fui ao mercado ontem.", es: "Fui al mercado ayer.", notePt: "Marcador fechado → indefinido." },
    ],
    exercises: [
      { prompt: "«La semana pasada ___ a Madrid».", options: ["he viajado", "viajé"], answer: 1, explainPt: "Tempo fechado → indefinido." },
      { prompt: "«Esta mañana ___ tres cafés».", options: ["he tomado", "tomé"], answer: 0, explainPt: "'Esta mañana' ainda faz parte do hoje (uso peninsular)." },
    ],
    test: [
      { prompt: "«¿Ya ___ la película?»", options: ["viste / has visto", "veías"], answer: 0, explainPt: "'Ya' pede indefinido (LatAm) ou perfecto (Espanha)." },
      { prompt: "«En 2019 ___ en Chile».", options: ["he vivido", "viví"], answer: 1, explainPt: "Ano específico terminado → indefinido." },
    ],
    reviewPt: ["Ayer/en 2020 → indefinido", "Hoy/ya/nunca → perfecto (Espanha)", "'Tenho feito' ≠ 'he hecho' literal"],
  },
  {
    id: "subjuntivo",
    level: "B2",
    title: "Subjuntivo em espanhol",
    summaryPt: "Usado com desejo, dúvida, emoção, negação e conjunções como 'para que', 'cuando' (futuro).",
    explanationPt: [
      "Estruturas típicas: «Quiero que vengas», «Espero que estés bien», «No creo que sea verdad».",
      "Com 'cuando' referindo-se ao futuro: «Cuando llegues, llámame».",
      "O português usa subjuntivo em contextos parecidos, mas as formas irregulares mudam: sea, esté, haya, vaya, sepa, pueda.",
    ],
    examples: [
      { es: "Ojalá que llueva mañana.", pt: "Tomara que chova amanhã." },
      { es: "Es importante que practiques cada día.", pt: "É importante que você pratique todo dia." },
      { es: "No creo que él tenga razón.", pt: "Não acho que ele tenha razão." },
    ],
    comparison: [
      { pt: "Quando eu chegar, te aviso.", es: "Cuando llegue, te aviso.", notePt: "Espanhol usa presente do subjuntivo, não futuro do subjuntivo." },
      { pt: "Se eu tivesse tempo, iria.", es: "Si tuviera tiempo, iría.", notePt: "Imperfeito do subjuntivo + condicional." },
    ],
    exercises: [
      { prompt: "«Quiero que tú ___ conmigo».", options: ["vienes", "vengas"], answer: 1, explainPt: "Desejo sobre outra pessoa → subjuntivo." },
      { prompt: "«Cuando ___ al hotel, descansamos».", options: ["llegamos", "lleguemos"], answer: 1, explainPt: "Futuro com 'cuando' → subjuntivo." },
    ],
    test: [
      { prompt: "«No creo que ___ verdad».", options: ["es", "sea"], answer: 1, explainPt: "Negação de crença → subjuntivo." },
      { prompt: "«Si yo ___ dinero, viajaría».", options: ["tendría", "tuviera"], answer: 1, explainPt: "Condicional irreal: si + imperfeito do subjuntivo." },
    ],
    reviewPt: ["Desejo/dúvida/emoção → subjuntivo", "Cuando + futuro → subjuntivo", "Si + tuviera → iría"],
  },
];
