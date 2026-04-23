# Zemoc

App de gerenciamento financeiro pessoal com foco em **controle de assinaturas** e gastos do dia a dia. Criado em 2026-04-22, destinado a **App Store** (iOS) e **Google Play** (Android).

Bundle ID: `app.zemoc` — Scheme: `zemoc://` — Slug: `zemoc`

## Stack

- **Expo SDK 54** + Expo Router 6 + TypeScript 5.9 + React 19 + React Native 0.81
- **Zustand 5** com `persist` → **AsyncStorage** (offline-first, sem backend)
- **expo-secure-store** + **expo-local-authentication** (PIN + biometria)
- **expo-document-picker** + **expo-sharing** + **expo-file-system** (backup/export)
- **Intl** (NumberFormat / DateTimeFormat) para formatação localizada
- Cores da marca em [constants/theme.ts](constants/theme.ts). Tema claro/escuro/automático reativo.

## Perfil do usuário

Iniciante em programação. Explicações passo a passo, comandos prontos para copiar, "porquê" antes do "como". Fala pt-BR. App é em inglês por padrão (pode trocar para pt nas Configurações).

## Como rodar

```bash
cd "/Users/francisconi/Documents/Apps Claude/zemoc"
npx expo start
```

Abra **Expo Go** no celular e escaneie o QR code. Hot reload automático. Se mudar `app.json`, precisa `--clear` e reabrir o app totalmente.

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
│   ├── i18n.ts                   # ~220 strings en/pt com useT() e t()
│   ├── format.ts                 # useMoney(), formatShortDate, formatLongMonth, etc.
│   ├── categorize.ts             # "uber" → Transport, "mercado" → Food
│   ├── categorize-income.ts      # "salário" → Salary, etc.
│   ├── parse-day.ts              # dateForDay(monthRef, day, isCurrentMonth) @ noon local
│   ├── billing.ts                # próximas cobranças das assinaturas
│   ├── insights.ts               # previsão fim de mês + categorias top
│   ├── export-csv.ts             # exporta tudo como CSV (via Sharing)
│   ├── backup.ts                 # exporta JSON completo + importa com DocumentPicker
│   └── security.ts               # savePin/verifyPin/clearPin via SecureStore
├── hooks/
│   ├── use-color-scheme.ts       # resolve light/dark/auto a partir de settings
│   ├── use-color-scheme.web.ts   # mesmo para web
│   ├── use-theme-color.ts        # helper
│   └── use-month-filter.ts       # offset do mês (±12) + derivados
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
- **Sobre:** Versão + Termos de uso + Política de privacidade (telas locais) + contato

## Decisões importantes

- **Sem autenticação/backend:** app é 100% local. PIN+biometria protege o device. Ver `~/.claude/.../memory/project_zemoc_no_auth.md` para o contexto da decisão.
- **Sem `reactCompiler`:** o experimento quebra reatividade do zustand em SDK 54. Não reativar sem testar. Ver `memory/feedback_react_compiler_zustand.md`.
- **Datas ao meio-dia local:** `new Date(Y, M, D, 12, 0, 0)` em vez de meia-noite UTC — evita bug de timezone que jogava datas futuras para o mês anterior.
- **Paleta reativa:** todos os componentes leem `Colors[scheme]`, nada usa `Brand.*` hardcoded (era a causa de o modo claro "não mudar" antes).

## Modelo de saldo

`saldo = receitas do mês − (gastos realizados + gastos planejados + assinaturas do mês)`.
Um item é "planejado" se `date > now`. Em meses futuros tudo vira planejado automaticamente.

## Publicação — próximos passos

1. Apple Developer Program (US$ 99/ano) + Google Play Console (US$ 25 one-time)
2. Finalizar ícones + splash + screenshots pras lojas
3. `eas build --platform ios` / `--platform android`
4. `eas submit`

Ainda não começamos — o MVP está pronto mas ainda não rodamos `eas build`. Quando o usuário voltar, provavelmente vai querer atacar esse caminho.
