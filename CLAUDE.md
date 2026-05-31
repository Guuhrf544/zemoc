# Zemoc

App de gerenciamento financeiro pessoal com foco em **controle de assinaturas** e gastos do dia a dia. Criado em 2026-04-22, destinado a **App Store** (iOS) e **Google Play** (Android).

Bundle ID: `app.zemoc` — Scheme: `zemoc://` — Slug: `zemoc`

## Stack

- **Expo SDK 54** + Expo Router 6 + TypeScript 5.9 + React 19 + React Native 0.81
- **expo-dev-client** — não usa mais Expo Go (1.1.0+, por causa do iCloud)
- **Zustand 5** com `persist` → **AsyncStorage** (offline-first)
- **expo-secure-store** + **expo-local-authentication** (PIN + biometria)
- **expo-document-picker** + **expo-sharing** + **expo-file-system** (backup/export)
- **react-native-cloud-store** — sync opcional via iCloud Documents (iOS only)
- **Intl** (NumberFormat / DateTimeFormat) para formatação localizada
- Cores da marca em [constants/theme.ts](constants/theme.ts). Tema claro/escuro/automático reativo.

## Perfil do usuário

Iniciante em programação. Explicações passo a passo, comandos prontos para copiar, "porquê" antes do "como". Fala pt-BR. App é em inglês por padrão (pode trocar para pt nas Configurações).

## Como rodar

```bash
cd "/Users/francisconi/Documents/Apps Claude/zemoc"
npx expo start
```

A partir de **1.1.0** o app NÃO roda mais no Expo Go (iCloud exige código nativo). Usa Development Build:

```bash
# Primeira vez (ou quando muda app.json/deps nativas):
eas build --profile development --platform ios
# Instala o .ipa no celular pelo link/QR code

# Dia a dia:
npx expo start --dev-client
```

Hot reload funciona normalmente no dev client.

## Estrutura

```
zemoc/
├── app/                          # rotas (Expo Router — file-based)
│   ├── _layout.tsx               # stack root + ThemeProvider + LockGate
│   ├── (tabs)/                   # 5 abas
│   │   ├── index.tsx             # Dashboard (saldo, stats, próximas cobranças)
│   │   ├── subscriptions.tsx     # Assinaturas mensais/anuais
│   │   ├── expenses.tsx          # Gastos + gráfico por categoria
│   │   ├── income.tsx            # Receitas (salário, freelance, etc.)
│   │   └── insights.tsx          # Categorias top + previsão + assinaturas p/ revisar
│   ├── expense/[id].tsx          # Editar gasto (modal)
│   ├── income/[id].tsx           # Editar receita (modal)
│   ├── subscription/[id].tsx     # Editar assinatura (modal)
│   ├── profile.tsx               # Perfil com foto/nome/email (modal)
│   ├── settings.tsx              # Configurações (modal)
│   ├── pin-setup.tsx             # Criar/alterar PIN (modal)
│   ├── terms.tsx                 # Termos de uso (modal)
│   └── privacy.tsx               # Política de privacidade (modal)
├── components/
│   ├── screen.tsx                # scaffold padrão (título + subtítulo + body)
│   ├── themed-text.tsx           # Text que respeita paleta
│   ├── balance-card.tsx          # card "hero" com saldo do mês
│   ├── forecast-card.tsx         # previsão fim de mês
│   ├── category-bar-chart.tsx    # gráfico de gastos por categoria
│   ├── category-chips.tsx        # seletor de categoria (genérico)
│   ├── picker-sheet.tsx          # bottom sheet com lista (mês, idioma, etc.)
│   ├── day-picker-sheet.tsx      # mini calendário para escolher dia
│   ├── pin-pad.tsx               # keypad numérico para PIN
│   ├── lock-gate.tsx             # overlay que bloqueia o app se PIN ativo
│   ├── month-selector.tsx        # dropdown de mês (±12 meses do atual)
│   ├── quick-expense-input.tsx   # parser "15 café" → gasto
│   ├── quick-income-input.tsx    # parser "3000 salário" → receita
│   ├── fab.tsx / button.tsx / segmented.tsx / stat-card.tsx / input.tsx
│   ├── settings-row.tsx / settings-section.tsx / profile-button.tsx
│   ├── expense-item.tsx / income-item.tsx / subscription-item.tsx
│   ├── upcoming-charges.tsx / review-subscription-item.tsx / empty-state.tsx
│   ├── haptic-tab.tsx            # hook de haptic feedback na tab bar
│   └── ui/
│       ├── icon-symbol.tsx       # MaterialIcons (Android/web)
│       └── icon-symbol.ios.tsx   # SF Symbols (iOS)
├── lib/
│   ├── store/
│   │   ├── settings.ts           # idioma, moeda, aparência, notif, PIN, biométrica
│   │   ├── subscriptions.ts      # CRUD de assinaturas
│   │   ├── expenses.ts           # CRUD de gastos
│   │   ├── incomes.ts            # CRUD de receitas
│   │   ├── profile.ts            # nome, foto, email
│   │   └── lock.ts               # estado de "unlocked" (em memória, sem persist)
│   ├── i18n.ts                   # ~240 strings en/pt com useT() e t()
│   ├── format.ts                 # useMoney(), formatShortDate, formatLongMonth, formatDateTime, etc.
│   ├── categorize.ts             # "uber" → Transport, "mercado" → Food
│   ├── categorize-income.ts      # "salário" → Salary, etc.
│   ├── parse-day.ts              # dateForDay(monthRef, day, isCurrentMonth) @ noon local
│   ├── billing.ts                # próximas cobranças das assinaturas
│   ├── insights.ts               # previsão fim de mês + categorias top
│   ├── export-csv.ts             # exporta tudo como CSV (via Sharing)
│   ├── backup.ts                 # build/parse/apply payload + export/import manual
│   ├── icloud.ts                 # camada baixa: read/write/exist do iCloud Documents
│   ├── cloud-sync.ts             # orquestração: debounce upload, decideOnLaunch, enable
│   └── security.ts               # savePin/verifyPin/clearPin via SecureStore
├── hooks/
│   ├── use-color-scheme.ts       # resolve light/dark/auto a partir de settings
│   ├── use-color-scheme.web.ts   # mesmo para web
│   ├── use-theme-color.ts        # helper
│   ├── use-month-filter.ts       # offset do mês (±12) + derivados
│   └── use-cloud-sync.ts         # monta sync no launch + foreground, controla subscriptions
├── types/models.ts               # Subscription, Expense, Income, Category, etc.
├── constants/theme.ts            # Colors (light/dark com hero, onAccent, etc.), Spacing, Radius, FontSize
├── app.json                      # Bundle ID, plugins (secure-store, local-auth)
└── assets/                       # ícones das lojas
```

## Marcos do MVP — todos concluídos

- **Marco 1** ✅ Fundação (tabs, tema, stores, tipos)
- **Marco 2** ✅ Assinaturas (CRUD + total mensal + billingPeriod monthly/yearly)
- **Marco 3** ✅ Gastos (quick parser + gráfico por categoria + auto-categorização)
- **Marco 4** ✅ Dashboard (saldo, stats, próximas cobranças, income com data)
- **Marco 5** ✅ Insights (previsão, categorias top, assinaturas p/ revisar)

## Configurações e segurança (já implementado)

- **Preferências:** idioma (en/pt), moeda (EUR/BRL/USD), aparência (claro/escuro/automático)
- **Notificações:** toggle (ainda sem lógica real de push)
- **Segurança:** PIN 4 dígitos (armazenado em SecureStore — Keychain iOS / EncryptedSharedPreferences Android) + biometria opcional (FaceID/TouchID/Android biometric via expo-local-authentication). Lock gate cobre o app inteiro no start se PIN ativo.
- **Dados:** Backup JSON completo (share sheet) + Restore JSON (DocumentPicker) + Export CSV
- **iCloud sync (1.1.0+):** toggle opt-in nas Configurações. Salva `zemoc-data.json` no container `iCloud.app.zemoc`. Last-write-wins entre devices. PIN e foto de perfil ficam **de fora** do sync (per-device). Upload debounced em 5s; pull no launch e no foreground (rate-limited 30s).
- **Sobre:** Versão + Termos de uso + Política de privacidade (telas locais) + contato

## Decisões importantes

- **iCloud Documents, não CloudKit Database:** sync via 1 arquivo JSON simples vs schema de registros. Mantém arquitetura simples e dados portáveis. Trade-off: conflito multi-device = last-write-wins. Ver `~/.claude/.../memory/project_zemoc_icloud_sync.md`.
- **PIN não sincroniza:** é per-device por design. Cada celular tem seu próprio PIN.
- **Sem `reactCompiler`:** o experimento quebra reatividade do zustand em SDK 54. Não reativar sem testar. Ver `memory/feedback_react_compiler_zustand.md`.
- **Datas ao meio-dia local:** `new Date(Y, M, D, 12, 0, 0)` em vez de meia-noite UTC — evita bug de timezone que jogava datas futuras para o mês anterior.
- **Paleta reativa:** todos os componentes leem `Colors[scheme]`, nada usa `Brand.*` hardcoded (era a causa de o modo claro "não mudar" antes).

## Modelo de saldo

`saldo = receitas do mês − (gastos realizados + gastos planejados + assinaturas do mês)`.
Um item é "planejado" se `date > now`. Em meses futuros tudo vira planejado automaticamente.

## Publicação

- **1.0.0** ✅ Publicado na App Store (somente iOS)
- **1.1.0** ✅ Publicado na App Store — adiciona iCloud sync
- **1.2.0** — em preparação. iOS: atualização. Android: **1º lançamento** (Google Play). Inclui correções (billing, previsão, validação de amount, CSV, sync por mtime, PIN), acessibilidade, datas reativas a idioma, categorização pt-BR e refactors estruturais (ListItemRow, HeroCard, BottomSheet, QuickEntryInput, createCrudStore, usePalette).
  - Nome **nas lojas** → "Zemoc - Financial Management" (o nome do app no celular continua "Zemoc" — `expo.name` não muda).
  - `version` compartilhado em 1.2.0 (iOS e Android); buildNumber/versionCode automáticos via EAS (`autoIncrement`).
  - **iOS:** `eas build --profile production --platform ios` → `eas submit --platform ios`; no App Store Connect trocar o nome da listagem + colar Novidades.
  - **Android (1º lançamento):** testar build primeiro (`--profile preview`), depois `eas build --profile production --platform android` → `eas submit --platform android`; criar o app no Play Console (listagem, Data Safety, classificação de conteúdo), nome "Zemoc - Financial Management". iCloud fica desligado no Android (gated por `Platform.OS`).
  - Notas de release (en/pt): [store-assets/release-notes-1.2.0.md](store-assets/release-notes-1.2.0.md)
