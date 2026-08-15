export type Phrase = { es: string; pt: string; tip?: string };

export type CourseSituation = {
  id: string;
  label: string;
  emoji: string;
  summary: string;
  phrases: Phrase[];
  vocab: Phrase[];
  simulation: { prompt: string; opener: string; mission: string };
};

/** Espanhol para Viajar */
export const TRAVEL_SITUATIONS: CourseSituation[] = [
  {
    id: "aeropuerto",
    label: "Aeroporto",
    emoji: "✈️",
    summary: "Check-in, bagagem, portão de embarque e atrasos.",
    phrases: [
      { es: "Quisiera facturar esta maleta.", pt: "Gostaria de despachar esta mala.", tip: "Na América Latina: «documentar/chequear la maleta»." },
      { es: "¿Dónde está la puerta de embarque?", pt: "Onde fica o portão de embarque?" },
      { es: "Mi vuelo está retrasado.", pt: "Meu voo está atrasado." },
      { es: "¿Puedo llevar esto como equipaje de mano?", pt: "Posso levar isto como bagagem de mão?" },
      { es: "Perdí mi conexión, ¿qué puedo hacer?", pt: "Perdi minha conexão, o que posso fazer?" },
    ],
    vocab: [
      { es: "el vuelo", pt: "o voo" },
      { es: "la tarjeta de embarque", pt: "o cartão de embarque" },
      { es: "la cinta de equipajes", pt: "a esteira de bagagens" },
      { es: "el asiento de pasillo", pt: "o assento do corredor" },
    ],
    simulation: {
      prompt: "Você é um agente de check-in num aeroporto espanhol. Peça passaporte, pergunte sobre bagagem e assento.",
      opener: "Buenos días, ¿me permite su pasaporte, por favor?",
      mission: "Faça o check-in, despache uma mala e peça assento na janela.",
    },
  },
  {
    id: "inmigracion",
    label: "Imigração",
    emoji: "🛂",
    summary: "Responder ao oficial com segurança e clareza.",
    phrases: [
      { es: "Vengo de vacaciones.", pt: "Venho a passeio/férias." },
      { es: "Me quedaré diez días.", pt: "Vou ficar dez dias." },
      { es: "Me alojo en el hotel Sol, en el centro.", pt: "Estou hospedado no hotel Sol, no centro." },
      { es: "Aquí está mi billete de vuelta.", pt: "Aqui está minha passagem de volta." },
      { es: "Viajo por trabajo, tengo una carta de invitación.", pt: "Viajo a trabalho, tenho uma carta-convite." },
    ],
    vocab: [
      { es: "el pasaporte", pt: "o passaporte" },
      { es: "la estancia", pt: "a estadia" },
      { es: "el motivo del viaje", pt: "o motivo da viagem" },
      { es: "la aduana", pt: "a alfândega" },
    ],
    simulation: {
      prompt: "Você é um oficial de imigração. Pergunte motivo da viagem, tempo de estadia e hospedagem.",
      opener: "Buenas tardes. ¿Cuál es el motivo de su viaje?",
      mission: "Explique o motivo da viagem, quantos dias fica e onde vai se hospedar.",
    },
  },
  {
    id: "hotel",
    label: "Hotel",
    emoji: "🏨",
    summary: "Check-in, pedidos no quarto e problemas comuns.",
    phrases: [
      { es: "Tengo una reserva a nombre de...", pt: "Tenho uma reserva no nome de..." },
      { es: "¿El desayuno está incluido?", pt: "O café da manhã está incluso?" },
      { es: "El aire acondicionado no funciona.", pt: "O ar-condicionado não funciona." },
      { es: "¿A qué hora es la salida?", pt: "Que horas é o check-out?" },
      { es: "¿Pueden guardarme las maletas?", pt: "Podem guardar minhas malas?" },
    ],
    vocab: [
      { es: "la habitación doble", pt: "o quarto de casal" },
      { es: "la recepción", pt: "a recepção" },
      { es: "la llave / la tarjeta", pt: "a chave / o cartão" },
      { es: "la toalla", pt: "a toalha" },
    ],
    simulation: {
      prompt: "Você é o recepcionista de um hotel. Faça check-in e resolva um problema no quarto.",
      opener: "¡Bienvenido! ¿Tiene una reserva con nosotros?",
      mission: "Faça o check-in e reclame que o chuveiro está com água fria.",
    },
  },
  {
    id: "taxi",
    label: "Táxi",
    emoji: "🚕",
    summary: "Pedir corrida, combinar preço e pagar.",
    phrases: [
      { es: "¿Cuánto cuesta hasta el centro?", pt: "Quanto custa até o centro?" },
      { es: "Lléveme a esta dirección, por favor.", pt: "Leve-me a este endereço, por favor." },
      { es: "¿Puede poner el taxímetro?", pt: "Pode ligar o taxímetro?" },
      { es: "Pare aquí, por favor.", pt: "Pare aqui, por favor." },
      { es: "¿Acepta tarjeta?", pt: "Aceita cartão?" },
    ],
    vocab: [
      { es: "la parada de taxis", pt: "o ponto de táxi" },
      { es: "el maletero", pt: "o porta-malas" },
      { es: "el cinturón", pt: "o cinto" },
      { es: "la propina", pt: "a gorjeta" },
    ],
    simulation: {
      prompt: "Você é um taxista simpático. Pergunte destino, converse sobre a cidade e cobre no final.",
      opener: "¡Hola! ¿A dónde lo llevo?",
      mission: "Peça para ir ao centro, pergunte o preço e pague com cartão.",
    },
  },
  {
    id: "restaurante",
    label: "Restaurante",
    emoji: "🍽️",
    summary: "Pedir mesa, prato do dia, restrições e conta.",
    phrases: [
      { es: "Una mesa para dos, por favor.", pt: "Uma mesa para dois, por favor." },
      { es: "¿Cuál es el plato del día?", pt: "Qual é o prato do dia?" },
      { es: "Soy alérgico a los frutos secos.", pt: "Sou alérgico a castanhas/nozes." },
      { es: "Estaba todo riquísimo.", pt: "Estava tudo delicioso." },
      { es: "La cuenta, por favor.", pt: "A conta, por favor." },
    ],
    vocab: [
      { es: "el primer plato", pt: "a entrada" },
      { es: "la carta", pt: "o cardápio" },
      { es: "el postre", pt: "a sobremesa" },
      { es: "sin gluten", pt: "sem glúten" },
    ],
    simulation: {
      prompt: "Você é um garçom. Sugira pratos, anote o pedido e traga a conta.",
      opener: "Buenas noches, ¿ya saben qué van a pedir?",
      mission: "Peça entrada, prato principal, água e depois a conta.",
    },
  },
  {
    id: "mercado",
    label: "Mercado",
    emoji: "🛒",
    summary: "Quantidades, pesos, preços e pagamento.",
    phrases: [
      { es: "¿A cuánto está el kilo?", pt: "Quanto está o quilo?" },
      { es: "Póngame medio kilo, por favor.", pt: "Me dê meio quilo, por favor." },
      { es: "¿Tiene algo más fresco?", pt: "Tem algo mais fresco?" },
      { es: "¿Dónde están los lácteos?", pt: "Onde ficam os laticínios?" },
      { es: "Nada más, gracias.", pt: "Só isso, obrigado." },
    ],
    vocab: [
      { es: "la bolsa", pt: "a sacola" },
      { es: "la caja", pt: "o caixa" },
      { es: "el descuento", pt: "o desconto" },
      { es: "la fruta", pt: "a fruta" },
    ],
    simulation: {
      prompt: "Você é um feirante. Ofereça produtos, informe preços e negocie quantidades.",
      opener: "¡Buenos días! ¿Qué le pongo?",
      mission: "Compre frutas, pergunte preços e peça uma sacola.",
    },
  },
  {
    id: "compras",
    label: "Compras",
    emoji: "🛍️",
    summary: "Tamanhos, provar roupa, trocas e devoluções.",
    phrases: [
      { es: "¿Puedo probármelo?", pt: "Posso experimentar?" },
      { es: "¿Lo tiene en otra talla?", pt: "Tem em outro tamanho?" },
      { es: "Me queda grande.", pt: "Ficou grande em mim." },
      { es: "¿Puedo cambiarlo si no me sirve?", pt: "Posso trocar se não servir?" },
      { es: "¿Hacen descuento por pagar en efectivo?", pt: "Dão desconto no dinheiro?" },
    ],
    vocab: [
      { es: "el probador", pt: "o provador" },
      { es: "la talla", pt: "o tamanho (roupa)" },
      { es: "el número", pt: "o número (sapato)" },
      { es: "el recibo", pt: "o recibo/nota" },
    ],
    simulation: {
      prompt: "Você é vendedor de uma loja de roupas. Ajude com tamanhos, cores e trocas.",
      opener: "Hola, ¿le ayudo en algo?",
      mission: "Peça para provar uma camisa, troque de tamanho e pergunte a política de troca.",
    },
  },
  {
    id: "emergencias",
    label: "Emergências",
    emoji: "🚑",
    summary: "Saúde, farmácia, roubo e ajuda urgente.",
    phrases: [
      { es: "¡Necesito ayuda, por favor!", pt: "Preciso de ajuda, por favor!" },
      { es: "Me duele mucho el estómago.", pt: "Estou com muita dor de estômago." },
      { es: "Me han robado la cartera.", pt: "Roubaram minha carteira." },
      { es: "¿Dónde está la farmacia más cercana?", pt: "Onde fica a farmácia mais próxima?" },
      { es: "Llamen a una ambulancia.", pt: "Chamem uma ambulância." },
    ],
    vocab: [
      { es: "el hospital", pt: "o hospital" },
      { es: "la comisaría", pt: "a delegacia" },
      { es: "el seguro de viaje", pt: "o seguro viagem" },
      { es: "la denuncia", pt: "o boletim de ocorrência" },
    ],
    simulation: {
      prompt: "Você é atendente de um pronto-socorro. Pergunte sintomas e oriente o paciente.",
      opener: "¿Qué le pasa? Cuénteme sus síntomas.",
      mission: "Explique que está com febre e dor de cabeça há dois dias.",
    },
  },
  {
    id: "direcciones",
    label: "Perguntar direções",
    emoji: "🧭",
    summary: "Localizar-se, entender instruções e distâncias.",
    phrases: [
      { es: "Perdone, ¿cómo llego al museo?", pt: "Desculpe, como chego ao museu?" },
      { es: "¿Está lejos de aquí?", pt: "É longe daqui?" },
      { es: "Siga todo recto y gire a la derecha.", pt: "Siga reto e vire à direita." },
      { es: "Estoy perdido.", pt: "Estou perdido." },
      { es: "¿Me lo puede repetir más despacio?", pt: "Pode repetir mais devagar?" },
    ],
    vocab: [
      { es: "la esquina", pt: "a esquina" },
      { es: "la manzana / la cuadra", pt: "o quarteirão" },
      { es: "a la izquierda", pt: "à esquerda" },
      { es: "enfrente de", pt: "em frente a" },
    ],
    simulation: {
      prompt: "Você é um morador local dando direções na rua, com referências e distâncias.",
      opener: "Claro, dígame: ¿a dónde quiere ir?",
      mission: "Pergunte como chegar à estação e confirme se dá para ir a pé.",
    },
  },
  {
    id: "transporte",
    label: "Transporte público",
    emoji: "🚇",
    summary: "Metrô, ônibus, bilhetes e baldeações.",
    phrases: [
      { es: "¿Qué línea va al centro?", pt: "Qual linha vai ao centro?" },
      { es: "Un billete de ida y vuelta, por favor.", pt: "Uma passagem de ida e volta, por favor." },
      { es: "¿Tengo que hacer transbordo?", pt: "Preciso fazer baldeação?" },
      { es: "¿Cada cuánto pasa el autobús?", pt: "De quanto em quanto tempo passa o ônibus?" },
      { es: "¿Esta parada es la mía?", pt: "Esta parada é a minha?" },
    ],
    vocab: [
      { es: "el andén", pt: "a plataforma" },
      { es: "el abono", pt: "o passe/bilhete recarregável" },
      { es: "la parada", pt: "o ponto/parada" },
      { es: "el horario", pt: "o horário" },
    ],
    simulation: {
      prompt: "Você é funcionário do metrô. Explique linhas, bilhetes e baldeações.",
      opener: "Buenas, ¿en qué le puedo ayudar?",
      mission: "Compre um bilhete e descubra qual linha leva ao aeroporto.",
    },
  },
];

/** Espanhol Profissional */
export const WORK_SITUATIONS: CourseSituation[] = [
  {
    id: "entrevista",
    label: "Entrevista de emprego",
    emoji: "🧑‍💼",
    summary: "Apresentar-se, falar de experiência e pontos fortes.",
    phrases: [
      { es: "Tengo cinco años de experiencia en el sector.", pt: "Tenho cinco anos de experiência no setor." },
      { es: "Me considero una persona resolutiva.", pt: "Me considero uma pessoa resolutiva." },
      { es: "Busco un nuevo reto profesional.", pt: "Busco um novo desafio profissional." },
      { es: "¿Cómo es el día a día del puesto?", pt: "Como é o dia a dia da vaga?" },
      { es: "¿Cuáles son los siguientes pasos del proceso?", pt: "Quais são os próximos passos do processo?" },
    ],
    vocab: [
      { es: "el currículum", pt: "o currículo" },
      { es: "el puesto", pt: "o cargo/vaga" },
      { es: "las habilidades", pt: "as habilidades" },
      { es: "el sueldo", pt: "o salário" },
    ],
    simulation: {
      prompt: "Você é um recrutador conduzindo uma entrevista formal. Faça perguntas de experiência e comportamento.",
      opener: "Buenos días, gracias por venir. Cuénteme sobre su trayectoria profesional.",
      mission: "Apresente-se, fale de duas conquistas e pergunte sobre a equipe.",
    },
  },
  {
    id: "emails",
    label: "E-mails",
    emoji: "✉️",
    summary: "Fórmulas de abertura, pedido e fechamento.",
    phrases: [
      { es: "Estimado/a Sr./Sra.:", pt: "Prezado(a) Sr./Sra.:" },
      { es: "Le escribo en relación con el proyecto.", pt: "Escrevo a respeito do projeto." },
      { es: "Adjunto el informe solicitado.", pt: "Segue em anexo o relatório solicitado." },
      { es: "Quedo a la espera de su respuesta.", pt: "Fico no aguardo da sua resposta." },
      { es: "Un cordial saludo,", pt: "Atenciosamente," },
    ],
    vocab: [
      { es: "el asunto", pt: "o assunto" },
      { es: "el archivo adjunto", pt: "o anexo" },
      { es: "la copia (CC)", pt: "a cópia" },
      { es: "el remitente", pt: "o remetente" },
    ],
    simulation: {
      prompt: "Você é um cliente respondendo e-mails. Peça ajustes e prazos por escrito, em tom formal.",
      opener: "Buenos días, ¿podría enviarme el estado actual del proyecto por escrito?",
      mission: "Escreva a resposta com saudação formal, status e fechamento.",
    },
  },
  {
    id: "reuniones",
    label: "Reuniões",
    emoji: "📅",
    summary: "Abrir pauta, opinar, discordar com educação.",
    phrases: [
      { es: "Vamos a repasar la agenda.", pt: "Vamos revisar a pauta." },
      { es: "Desde mi punto de vista...", pt: "Do meu ponto de vista..." },
      { es: "No estoy del todo de acuerdo.", pt: "Não concordo totalmente." },
      { es: "¿Podemos concretar los próximos pasos?", pt: "Podemos definir os próximos passos?" },
      { es: "Lo dejamos para la próxima reunión.", pt: "Deixamos para a próxima reunião." },
    ],
    vocab: [
      { es: "el acta", pt: "a ata" },
      { es: "el plazo", pt: "o prazo" },
      { es: "el seguimiento", pt: "o acompanhamento" },
      { es: "el objetivo", pt: "a meta" },
    ],
    simulation: {
      prompt: "Você conduz uma reunião de equipe e cobra atualizações do aluno.",
      opener: "Buenos días a todos. ¿Cómo va el avance de esta semana?",
      mission: "Dê seu status, discorde de um prazo e proponha uma solução.",
    },
  },
  {
    id: "presentaciones",
    label: "Apresentações",
    emoji: "📊",
    summary: "Estruturar a fala, mostrar dados e concluir.",
    phrases: [
      { es: "Hoy voy a hablarles de...", pt: "Hoje vou falar a vocês sobre..." },
      { es: "Como pueden ver en el gráfico...", pt: "Como podem ver no gráfico..." },
      { es: "Esto supone un aumento del 20 %.", pt: "Isso representa um aumento de 20%." },
      { es: "En resumen, las conclusiones son...", pt: "Em resumo, as conclusões são..." },
      { es: "¿Alguna pregunta?", pt: "Alguma pergunta?" },
    ],
    vocab: [
      { es: "la diapositiva", pt: "o slide" },
      { es: "el crecimiento", pt: "o crescimento" },
      { es: "los datos", pt: "os dados" },
      { es: "la propuesta", pt: "a proposta" },
    ],
    simulation: {
      prompt: "Você é um diretor assistindo a uma apresentação. Faça perguntas críticas sobre os números.",
      opener: "Adelante, le escuchamos. ¿Cuáles son los resultados del trimestre?",
      mission: "Apresente resultados, explique um dado e responda a uma objeção.",
    },
  },
  {
    id: "atencion",
    label: "Atendimento ao cliente",
    emoji: "🎧",
    summary: "Acolher, resolver reclamações e fechar o atendimento.",
    phrases: [
      { es: "¿En qué puedo ayudarle?", pt: "Em que posso ajudá-lo?" },
      { es: "Lamento mucho las molestias.", pt: "Lamento muito o transtorno." },
      { es: "Permítame revisar su caso.", pt: "Permita-me verificar seu caso." },
      { es: "Le ofrezco una solución alternativa.", pt: "Ofereço uma solução alternativa." },
      { es: "¿Hay algo más en lo que pueda ayudarle?", pt: "Posso ajudar em algo mais?" },
    ],
    vocab: [
      { es: "la queja / el reclamo", pt: "a reclamação" },
      { es: "el reembolso", pt: "o reembolso" },
      { es: "la garantía", pt: "a garantia" },
      { es: "el pedido", pt: "o pedido" },
    ],
    simulation: {
      prompt: "Você é um cliente irritado com um pedido atrasado. O aluno é o atendente.",
      opener: "¡Llevo dos semanas esperando mi pedido y nadie me responde!",
      mission: "Acalme o cliente, explique a situação e ofereça uma solução.",
    },
  },
  {
    id: "negociacion",
    label: "Negociação",
    emoji: "🤝",
    summary: "Propor, contrapor e fechar acordos.",
    phrases: [
      { es: "Nuestra propuesta incluye...", pt: "Nossa proposta inclui..." },
      { es: "¿Habría margen para negociar el precio?", pt: "Haveria margem para negociar o preço?" },
      { es: "Podríamos llegar a un punto medio.", pt: "Poderíamos chegar a um meio-termo." },
      { es: "Eso se sale de nuestro presupuesto.", pt: "Isso foge do nosso orçamento." },
      { es: "Cerramos el acuerdo entonces.", pt: "Fechamos o acordo, então." },
    ],
    vocab: [
      { es: "el presupuesto", pt: "o orçamento" },
      { es: "el contrato", pt: "o contrato" },
      { es: "la contraoferta", pt: "a contraproposta" },
      { es: "el descuento por volumen", pt: "o desconto por volume" },
    ],
    simulation: {
      prompt: "Você é um fornecedor duro na negociação de preço e prazo.",
      opener: "Le puedo ofrecer el servicio por 10.000 euros, entrega en tres meses.",
      mission: "Negocie preço menor e prazo mais curto, sem perder a educação.",
    },
  },
  {
    id: "vocabulario-empresarial",
    label: "Vocabulário empresarial",
    emoji: "🏢",
    summary: "Termos de negócios, áreas e indicadores.",
    phrases: [
      { es: "La empresa facturó más este año.", pt: "A empresa faturou mais este ano." },
      { es: "El equipo depende de Recursos Humanos.", pt: "A equipe é subordinada ao RH." },
      { es: "Hay que reducir costes.", pt: "É preciso reduzir custos.", tip: "Na América Latina: «costos»." },
      { es: "Vamos a lanzar el producto en marzo.", pt: "Vamos lançar o produto em março." },
      { es: "El informe muestra una caída en ventas.", pt: "O relatório mostra queda nas vendas." },
    ],
    vocab: [
      { es: "la junta directiva", pt: "o conselho/diretoria" },
      { es: "el rendimiento", pt: "o desempenho/rendimento" },
      { es: "la facturación", pt: "o faturamento" },
      { es: "el proveedor", pt: "o fornecedor" },
    ],
    simulation: {
      prompt: "Você é um colega do financeiro explicando indicadores da empresa.",
      opener: "¿Quieres que repasemos los números del trimestre?",
      mission: "Pergunte sobre faturamento, custos e metas usando o vocabulário novo.",
    },
  },
  {
    id: "conversas",
    label: "Conversas profissionais",
    emoji: "☕",
    summary: "Small talk, networking e tom adequado.",
    phrases: [
      { es: "¿Qué tal va todo por tu área?", pt: "Como vão as coisas na sua área?" },
      { es: "Encantado de conocerte, soy...", pt: "Prazer em conhecê-lo, sou..." },
      { es: "¿Nos tomamos un café y lo hablamos?", pt: "Tomamos um café e conversamos?" },
      { es: "Te paso mi contacto por LinkedIn.", pt: "Te passo meu contato pelo LinkedIn." },
      { es: "Ha sido un placer trabajar contigo.", pt: "Foi um prazer trabalhar com você." },
    ],
    vocab: [
      { es: "el compañero", pt: "o colega" },
      { es: "la jefa", pt: "a chefe" },
      { es: "el ascenso", pt: "a promoção" },
      { es: "el teletrabajo", pt: "o trabalho remoto" },
    ],
    simulation: {
      prompt: "Você é um colega novo num evento de networking. Converse de forma leve e profissional.",
      opener: "Hola, creo que no nos conocemos. ¿En qué área trabajas?",
      mission: "Apresente-se, fale do seu trabalho e combine um café.",
    },
  },
];
