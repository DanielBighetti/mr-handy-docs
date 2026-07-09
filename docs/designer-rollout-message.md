# Designer rollout message — Mr. Handy 1.9.4

Copy-paste-ready message for sharing the tool with the design team. Two versions: **English** and **Português (Brasil)**. Same content, same structure, side by side so you can pick whichever your team uses.

---

## EN — Designer rollout message

> **Subject:** New design-handoff helper — Mr. Handy 1.9.4

Hi team,

I'm rolling out **Mr. Handy 1.9.4**, an AI design-handoff specialist that lives inside Cursor and turns Figma flows into developer-ready documentation (Markdown + HTML + Figma canvas annotations).

It runs *entirely on your machine* — no SaaS, no design files leaving your laptop. We get faster, more consistent handoffs and a coverage matrix that actually tells engineering what's missing.

### What I need from each of you (one-time, ~10 min)

To use the tool we need the following installed and configured:

1. **Cursor** (the IDE Mr. Handy lives inside) — https://cursor.com
2. **Figma Desktop** (only required if you'll use `/handoff-component` — the uSpec extractor is desktop-only) — https://www.figma.com/downloads/
3. **Node.js ≥ 18** — https://nodejs.org/en/download
4. **A Figma account** — no PAT, no email, no API token. The IDE opens a browser to `figma-console-mcp.southleft.com` the first time it calls Figma; you click **Allow** and the token is cached. (Optionally: an **Atlassian account** if you also want the Atlassian MCP — same flow.)
5. **The Figma MCP server** (installed automatically by the setup wizard): **Figma Console MCP** (reads + writes, OAuth) → https://figma-console-mcp.southleft.com
6. **The uSpec Extract Figma Desktop plugin** (one-time manual import — Figma's policy, can't automate it). Required only for `/handoff-component`. Manifest at `figma-plugin/manifest.json` inside the bundle.

### Quick install (5 minutes, once)

1. Unzip `MrHandy-1.9.4-…zip` somewhere stable (e.g. `~/work/mr-handy/`).
2. Open the folder in Cursor (`File → Open Folder…`).
3. Open the integrated terminal and run:

   ```bash
   # macOS / Linux / WSL
   ./setup-mrhandy.sh
   # Windows
   Setup-MrHandy.bat
   ```

   The wizard runs **silently by default** — no readline prompts, placeholders are valid, idempotent re-runs. It populates `mr-handy.config.json`, asks one y/N question for the optional Atlassian MCP, writes the per-IDE `mcp.json` for every IDE it detects, and builds the uSpec extractor. Figma and Atlassian auth are OAuth — there's no PAT to paste. If you want the full interactive flow (custom project name, design system, etc.), set `SETUP_INTERACTIVE=1` and re-run.

4. **Restart Cursor** so the MCP servers boot.
5. **Sign in to Figma in the browser** the first time you call a Figma tool from the IDE — the browser opens to `figma-console-mcp.southleft.com`, you click **Allow**, and the token is cached.
6. (Per-component path only) **Import the uSpec Extract plugin**:
   - Plugins → Development → Import plugin from manifest…
   - Select `<unzip-folder>/figma-plugin/manifest.json`
7. **Health check** — run from the repo root:

   ```bash
   node setup-mrhandy.mjs --doctor
   ```

   You should see 8+ green ticks. If anything fails, the row tells you exactly how to fix it; full reference is in `Knowledge/run-log/doctor-schema.md`.

### How to use it (90 seconds)

In Cursor, open a new chat in the Mr. Handy folder and type:

```
hi
```

Mr. Handy will greet you and ask:

- What project are we working on?
- Per-screen flow handoff (`/handoff-create`) or per-component spec (`/handoff-component`)?
- Figma URL of the flow / component
- Product type (dashboard / form / wizard / table / marketing / etc.)
- HTML deliverable yes/no
- Figma canvas deliverable yes/no
- Optional Jira EPIC key for traceability

Then it goes through Phases 0–5: discovery → flow mapping (which screens are in scope — you confirm) → screen analysis → phased build (happy path / conditionals / errors / business rules) → validation. When it finishes you get:

- `Handoff-{Flow-Name}.md` — the Markdown manifest engineering reads
- `Handoff-{Flow-Name}.html` — open in a browser to review with PMs (if HTML toggle = yes)
- A Figma canvas page next to your screens with SpecCards / Notes / dot annotations (if Figma toggle = yes)
- A coverage matrix listing every screen × every state, plus an "Open questions" section

### What I need you to share back — TELEMETRY IS THE PRIORITY

The single most important thing you can send me is **the contents of the `Knowledge/run-log/` folder**. It's how I improve the tool for everyone. Without it I'm guessing.

**1. The telemetry folder — `Knowledge/run-log/` (REQUIRED)**

Every time you run a handoff, Mr. Handy automatically writes one structured record to `Knowledge/run-log/{date}.jsonl`. The setup wizard also stamps `Knowledge/run-log/doctor-{date}.jsonl`. I need both.

**How to send it:**

```bash
# macOS / Linux / WSL — from the Mr. Handy folder
zip -r run-log-yourname.zip Knowledge/run-log/

# Windows PowerShell — from the Mr. Handy folder
Compress-Archive -Path Knowledge\run-log\* -DestinationPath run-log-yourname.zip
```

Send `run-log-yourname.zip` to me on Slack / email after every batch of runs (don't wait — even one run is useful). If you don't want to script it, just zip the `Knowledge/run-log/` folder by hand in Finder / Explorer and drop it.

**Cadence:** ideally after every handoff for the first two weeks, then weekly.

**Privacy — read this:** the log captures `runId`, timestamps, command name, project name, design system name, mode, phase durations, reroute counts, verification failures, screen IDs, node IDs, coverage counts, deliverable file paths, and the rules version. It does **NOT** capture: your Figma OAuth token, design content, screenshot binaries, the actual Markdown/HTML output, or anything from your `mr-handy.config.json` outside `project.name` and `designSystem`. If a specific project is sensitive, omit that day's `.jsonl` from the zip — but please send everything else.

**2. The first handoff you produce** — zip the project folder or share the `.md` / `.html` / Figma link. Helps me see how the rules play out on real designs.

**3. Anything that surprised you** — wrong field, missing scenario, awkward phrasing, "I'd never write it like that". A one-liner is enough; I'll convert it into a rule update.

### Useful links

- Setup walkthrough: `docs/getting-started.md` (inside the bundle)
- How it works: `docs/how-it-works.md`
- Troubleshooting: `docs/help/troubleshooting.md`
- Doctor reference: `Knowledge/run-log/doctor-schema.md`
- Changelog: `CHANGELOG.md`
- Figma Console MCP: https://figma-console-mcp.southleft.com
- Atlassian MCP: https://mcp.atlassian.com
- Cursor: https://cursor.com
- Figma Desktop: https://www.figma.com/downloads/
- Node.js: https://nodejs.org/en/download

Ping me on Slack with anything that breaks. The faster the feedback loop, the faster Mr. Handy gets useful for your specific projects.

— *(your name)*

---

## PT-BR — Mensagem de rollout para os designers

> **Assunto:** Nova ferramenta de design handoff — Mr. Handy 1.9.4

Olá time,

Estou liberando o **Mr. Handy 1.9.4**, um especialista de design handoff via IA que roda dentro do Cursor e transforma fluxos do Figma em documentação pronta para o time de engenharia (Markdown + HTML + anotações no canvas do Figma).

Ele roda *inteiramente na sua máquina* — nada de SaaS, nenhum arquivo de design sai do seu laptop. O resultado: handoffs mais rápidos, mais consistentes, e uma matriz de cobertura que mostra de verdade pra engenharia o que está faltando.

### O que eu preciso de cada um (uma vez só, ~10 min)

Para usar a ferramenta, é necessário ter o seguinte instalado e configurado:

1. **Cursor** (a IDE onde o Mr. Handy vive) — https://cursor.com
2. **Figma Desktop** (só se você for usar `/handoff-component` — o uSpec extractor é desktop-only) — https://www.figma.com/downloads/
3. **Node.js ≥ 18** — https://nodejs.org/en/download
4. **Uma conta no Figma** — sem PAT, sem email, sem API token. Na primeira vez que a IDE chamar o Figma, o navegador abre em `figma-console-mcp.southleft.com`; você clica em **Allow** e o token fica em cache. (Opcional: uma **conta no Atlassian** se você também quiser o MCP do Atlassian — mesmo fluxo.)
5. **O servidor MCP do Figma** (instalado automaticamente pelo setup): **Figma Console MCP** (leitura + escrita, OAuth) → https://figma-console-mcp.southleft.com
6. **O plugin uSpec Extract do Figma Desktop** (importação manual, uma vez só — é uma política do Figma, não dá pra automatizar). Necessário só pro `/handoff-component`. Manifest em `figma-plugin/manifest.json` dentro do bundle.

### Instalação rápida (5 minutos, uma vez)

1. Descompacte `MrHandy-1.9.4-…zip` em algum lugar estável (ex.: `~/work/mr-handy/`).
2. Abra a pasta no Cursor (`File → Open Folder…`).
3. Abra o terminal integrado e rode:

   ```bash
   # macOS / Linux / WSL
   ./setup-mrhandy.sh
   # Windows
   Setup-MrHandy.bat
   ```

   O wizard roda **em modo silencioso por padrão** — sem prompts, placeholders são válidos, re-rodar é idempotente. Ele popula `mr-handy.config.json`, faz uma única pergunta y/N pro Atlassian MCP (opcional), grava o `mcp.json` por IDE pra todo IDE detectado, e compila o uSpec extractor. A autenticação do Figma e do Atlassian é via OAuth — não tem PAT pra colar. Se você quiser o fluxo interativo completo (nome do projeto, design system, etc.), exporte `SETUP_INTERACTIVE=1` e rode de novo.

4. **Reinicie o Cursor** pra os servidores MCP subirem.
5. **Faça login no Figma pelo navegador** na primeira vez que você chamar uma ferramenta de Figma da IDE — o navegador abre em `figma-console-mcp.southleft.com`, você clica em **Allow**, e o token fica em cache.
6. (Apenas para o caminho per-component) **Importe o plugin uSpec Extract**:
   - Plugins → Development → Import plugin from manifest…
   - Selecione `<pasta-descompactada>/figma-plugin/manifest.json`
7. **Health check** — rode na raiz do repo:

   ```bash
   node setup-mrhandy.mjs --doctor
   ```

   Você deve ver 8+ marcações verdes. Se algo falhar, a linha mostra exatamente como corrigir; a referência completa está em `Knowledge/run-log/doctor-schema.md`.

### Como usar (90 segundos)

No Cursor, abra um novo chat dentro da pasta do Mr. Handy e digite:

```
oi
```

O Mr. Handy vai cumprimentar e perguntar:

- Em qual projeto estamos trabalhando?
- Handoff de fluxo per-screen (`/handoff-create`) ou spec per-component (`/handoff-component`)?
- URL do Figma do fluxo / componente
- Tipo de produto (dashboard / formulário / wizard / tabela / marketing / etc.)
- Entrega em HTML sim/não
- Entrega no canvas do Figma sim/não
- (Opcional) chave de EPIC do Jira pra rastreabilidade

Daí ele roda as Fases 0–5: descoberta → mapeamento de fluxo (você confirma quais telas estão no escopo) → análise de tela → build em fases (happy path / condicionais / erros / regras de negócio) → validação. No final você recebe:

- `Handoff-{Nome-Do-Fluxo}.md` — o manifesto Markdown que a engenharia lê
- `Handoff-{Nome-Do-Fluxo}.html` — abre no navegador pra revisar com os POs (se o toggle de HTML = sim)
- Uma página no canvas do Figma ao lado das suas telas com SpecCards / Notes / anotações de marcador (se o toggle de Figma = sim)
- Uma matriz de cobertura listando cada tela × cada estado, mais uma seção "Open questions"

### O que eu preciso que vocês me devolvam — A TELEMETRIA É PRIORIDADE

A coisa mais importante que vocês podem me mandar é **o conteúdo da pasta `Knowledge/run-log/`**. É com isso que eu melhoro a ferramenta pra todo mundo. Sem isso eu fico no chute.

**1. A pasta de telemetria — `Knowledge/run-log/` (OBRIGATÓRIO)**

Toda vez que vocês rodam um handoff, o Mr. Handy escreve automaticamente um registro estruturado em `Knowledge/run-log/{data}.jsonl`. O setup também grava `Knowledge/run-log/doctor-{data}.jsonl`. Eu preciso dos dois.

**Como mandar:**

```bash
# macOS / Linux / WSL — dentro da pasta do Mr. Handy
zip -r run-log-seunome.zip Knowledge/run-log/

# Windows PowerShell — dentro da pasta do Mr. Handy
Compress-Archive -Path Knowledge\run-log\* -DestinationPath run-log-seunome.zip
```

Me manda `run-log-seunome.zip` no Slack / e-mail depois de cada lote de runs (não precisa esperar — mesmo um run só já ajuda). Se não quiser scriptar, só zipa a pasta `Knowledge/run-log/` na unha pelo Finder / Explorer e me envia.

**Frequência:** o ideal é depois de todo handoff nas duas primeiras semanas, depois disso uma vez por semana.

**Sobre privacidade — leia isso:** o log captura `runId`, timestamps, nome do comando, nome do projeto, nome do design system, mode, durações de fase, contagens de reroute, falhas de verificação, IDs de tela, IDs de nó, contagens de cobertura, caminhos dos artefatos entregues, e a versão das regras. **NÃO** captura: o seu token OAuth do Figma, conteúdo de design, screenshots, o Markdown/HTML produzido, nem nada do `mr-handy.config.json` além de `project.name` e `designSystem`. Se algum projeto específico for sensível, deixa o `.jsonl` daquele dia de fora do zip — mas me manda o resto.

**2. O primeiro handoff que vocês produzirem** — zipa a pasta do projeto ou compartilha o `.md` / `.html` / link do Figma. Me ajuda a ver como as regras se comportam com designs reais.

**3. Qualquer coisa que te surpreendeu** — campo errado, cenário faltando, frase esquisita, "eu jamais escreveria assim". Uma frase basta; eu transformo em update de regra.

### Links úteis

- Walkthrough do setup: `docs/getting-started.md` (dentro do bundle)
- Como funciona: `docs/how-it-works.md`
- Troubleshooting: `docs/help/troubleshooting.md`
- Referência do doctor: `Knowledge/run-log/doctor-schema.md`
- Changelog: `CHANGELOG.md`
- Figma Console MCP: https://figma-console-mcp.southleft.com
- Atlassian MCP: https://mcp.atlassian.com
- Cursor: https://cursor.com
- Figma Desktop: https://www.figma.com/downloads/
- Node.js: https://nodejs.org/en/download

Me chama no Slack se algo quebrar. Quanto mais rápido o ciclo de feedback, mais rápido o Mr. Handy fica útil pros seus projetos específicos.

— *(seu nome)*
