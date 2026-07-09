const translations = {
  pt: {
    nav_overview: "Visão geral",
    nav_how: "Como funciona",
    nav_tracks: "Trilhas",
    nav_demo: "Demo",
    nav_setup: "Instalação",
    nav_faq: "FAQ",

    eyebrow: "Documentação interativa · Handoff · Figma · IA",
    hero_title: "Mr. Handy transforma arquivos Figma em handoffs claros, rastreáveis e prontos para squads.",
    hero_text: "Uma experiência de documentação para times de design, tecnologia e produto: fluxos, regras de negócio, componentes, tokens, acessibilidade e entregáveis em Markdown, HTML e canvas.",
    cta_start: "Começar agora",
    cta_v1: "Ver versão atual",

    card_title: "Nova experiência bilíngue",
    card_text: "Interface única, dark-first, pública e preparada para conteúdo executivo e técnico.",

    how_eyebrow: "Como funciona",
    how_title: "Do Figma ao handoff estruturado",
    how_1_title: "Lê o design",
    how_1_text: "Analisa telas, componentes, hierarquia visual, tokens e estados relevantes.",
    how_2_title: "Organiza o raciocínio",
    how_2_text: "Mapeia jornadas, condicionais, erros, regras de negócio e cobertura de cenários.",
    how_3_title: "Entrega documentação",
    how_3_text: "Gera documentação pronta para squads, QA, engenharia, produto e liderança.",

    tracks_eyebrow: "Trilhas",
    tracks_title: "Três formas de operar",
    track_a: "Markdown, HTML e screenshots para documentação fora do Figma.",
    track_b: "Documentação gerada diretamente no canvas do Figma.",
    track_c: "Especificação profunda de componentes, variantes, tokens, estrutura e acessibilidade.",

    demo_eyebrow: "Veja em ação",
    demo_title: "O que é fisicamente o Mr. Handy?",
    demo_text: "Mr. Handy é um workspace operacional que conecta IDE, Figma, agentes de IA, MCPs e documentação estruturada para transformar telas e componentes em handoffs prontos para execução.",
    outputs_label: "Outputs principais",
    output_1: "Markdown, HTML navegável e screenshots por tela para handoff fora do Figma.",
    output_2: "Documentação criada diretamente no canvas do Figma, com SpecCards e notas visuais.",
    output_3: "Especificação profunda de componentes, variantes, tokens, estrutura, motion e acessibilidade.",
    output_4: "Rastreabilidade da execução, cobertura, fases, reroutes e validações do pipeline.",

    setup_eyebrow: "Instalação",
    setup_title: "Ambiente necessário",
    setup_text: "O Mr. Handy opera com Node.js, Cursor ou IDE compatível, Figma OAuth e plugin uSpec Extract para o fluxo de componentes.",
    setup_1: "Runtime necessário para setup e ferramentas.",
    setup_2: "Ambiente onde os comandos e MCPs são carregados.",
    setup_3: "Autorização via navegador, sem PAT manual.",
    setup_4: "Plugin usado no caminho de especificação de componentes.",

    faq_title: "Perguntas frequentes",
    faq_1_q: "O Mr. Handy cria design?",
    faq_1_a: "Não. Ele lê designs prontos e gera documentação estruturada para execução, validação e handoff.",
    faq_2_q: "Precisa de token manual do Figma?",
    faq_2_a: "Não. O fluxo atual usa OAuth via navegador.",
    faq_3_q: "Essa versão substitui a documentação atual?",
    faq_3_a: "Não. Esta é uma versão v2 independente. A versão anterior permanece publicada.",

    footer_v1: "Voltar para versão atual"
  },

  en: {
    nav_overview: "Overview",
    nav_how: "How it works",
    nav_tracks: "Tracks",
    nav_demo: "Demo",
    nav_setup: "Setup",
    nav_faq: "FAQ",

    eyebrow: "Interactive documentation · Handoff · Figma · AI",
    hero_title: "Mr. Handy turns Figma files into clear, traceable handoffs ready for delivery squads.",
    hero_text: "A documentation experience for design, technology, and product teams: flows, business rules, components, tokens, accessibility, and deliverables in Markdown, HTML, and canvas.",
    cta_start: "Get started",
    cta_v1: "View current version",

    card_title: "New bilingual experience",
    card_text: "A unique, dark-first, public interface prepared for executive and technical content.",

    how_eyebrow: "How it works",
    how_title: "From Figma to structured handoff",
    how_1_title: "Reads the design",
    how_1_text: "Analyzes screens, components, visual hierarchy, tokens, and relevant states.",
    how_2_title: "Structures the reasoning",
    how_2_text: "Maps journeys, conditionals, errors, business rules, and scenario coverage.",
    how_3_title: "Delivers documentation",
    how_3_text: "Generates documentation ready for squads, QA, engineering, product, and leadership.",

    tracks_eyebrow: "Tracks",
    tracks_title: "Three ways to operate",
    track_a: "Markdown, HTML, and screenshots for documentation outside Figma.",
    track_b: "Documentation generated directly inside the Figma canvas.",
    track_c: "Deep component specification covering variants, tokens, structure, and accessibility.",

    demo_eyebrow: "See it in action",
    demo_title: "What is Mr. Handy physically?",
    demo_text: "Mr. Handy is an operational workspace that connects IDE, Figma, AI agents, MCPs, and structured documentation to turn screens and components into execution-ready handoffs.",
    outputs_label: "Main outputs",
    output_1: "Markdown, browsable HTML, and per-screen screenshots for handoff outside Figma.",
    output_2: "Documentation created directly in the Figma canvas with SpecCards and visual notes.",
    output_3: "Deep component specification covering variants, tokens, structure, motion, and accessibility.",
    output_4: "Execution traceability, coverage, phases, reroutes, and pipeline validations.",

    setup_eyebrow: "Setup",
    setup_title: "Required environment",
    setup_text: "Mr. Handy runs with Node.js, Cursor or compatible IDE, Figma OAuth, and the uSpec Extract plugin for the component path.",
    setup_1: "Runtime required for setup and tooling.",
    setup_2: "Environment where commands and MCPs are loaded.",
    setup_3: "Browser-based authorization, with no manual PAT.",
    setup_4: "Plugin used for the component specification path.",

    faq_title: "Frequently asked questions",
    faq_1_q: "Does Mr. Handy create design?",
    faq_1_a: "No. It reads finished designs and generates structured documentation for execution, validation, and handoff.",
    faq_2_q: "Does it require a manual Figma token?",
    faq_2_a: "No. The current flow uses browser-based OAuth.",
    faq_3_q: "Does this version replace the current documentation?",
    faq_3_a: "No. This is an independent v2. The previous version remains published.",

    footer_v1: "Back to current version"
  }
};

let currentLang = "pt";

function applyLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (translations[lang][key]) {
      element.textContent = translations[lang][key];
    }
  });

  const toggle = document.getElementById("langToggle");
  toggle.textContent = lang === "pt" ? "EN" : "PT";
}

document.getElementById("langToggle").addEventListener("click", () => {
  applyLanguage(currentLang === "pt" ? "en" : "pt");
});

applyLanguage(currentLang);

