# Zemoc · Store listings

Copy-paste-ready texts for App Store Connect e Google Play Console.
Limites de caracteres estão marcados no formato `(N chars · max M)`.

---

## App name (both stores · max 30)

`Zemoc` (5)

> Use só o nome. Se quiser reforçar, pode ser `Zemoc — Finanças` (16) ou `Zemoc Financial Tracker` (23).

---

## Subtitle — iOS only (max 30)

- EN: `Subscriptions & spending` (24)
- PT: `Assinaturas e gastos` (20)

---

## Short description — Google Play only (max 80)

- EN: `Track subscriptions, expenses, income. 100% offline. No account.` (65)
- PT: `Assinaturas, gastos e receitas. 100% offline, sem cadastro.` (59)

---

## Promotional text — App Store only (max 170, editável sem revisão)

- EN: `Know where your money actually goes. Zemoc runs entirely on your device — no account, no cloud, no tracking.` (109)
- PT: `Saiba para onde seu dinheiro realmente vai. O Zemoc roda 100% no seu dispositivo — sem conta, sem nuvem, sem rastreamento.` (122)

---

## Keywords — App Store only (max 100, comma-separated, sem espaços)

- EN: `finance,budget,expense,tracker,subscriptions,income,money,personal,offline,private` (82)
- PT: `financas,orcamento,gastos,controle,assinaturas,renda,dinheiro,pessoal,offline,privado` (85)

> Sem acentos aumenta match. Não repita palavras do nome/subtítulo (não conta pontos e ocupa espaço).

---

## Full description — EN (max 4000)

```
Take control of your money without sending a single cent to the cloud.

Zemoc is a personal finance tracker that lives entirely on your device. Track your subscriptions, expenses, and income — see what you really spend each month, forecast how the month ends, and never be surprised by a recurring charge again.

WHY ZEMOC

• Offline-first. No account, no signup, no cloud sync. Your financial data never leaves your phone.
• Subscription-first. Most expense apps treat Netflix the same as a coffee. Zemoc separates recurring charges so you can actually see what is eating your budget each month.
• Your numbers, your rules. Built for real people watching personal finances — not for accountants filling spreadsheets.

KEY FEATURES

• Dashboard with running balance: "April ended at +500, May starts there."
• Subscription tracking — monthly and yearly, with next billing date for each
• Quick expense entry — type "15 coffee" and Zemoc categorizes it for you
• Income tracking — salary, freelance, bonuses, investments and more
• End-of-month forecast based on realized and planned spending
• Top categories and insights to show where your money actually goes
• "Subscriptions to review" — flags services you might want to cancel
• Monthly navigation — jump to any past or future month
• Backup and restore in JSON plus CSV export — your data is always portable
• PIN and biometric lock (Face ID, Touch ID, Android biometrics)

PRIVACY AT THE CORE

• Data stored locally with your device's secure storage
• PIN stored in iOS Keychain / Android EncryptedSharedPreferences
• No analytics SDKs, no ads, no third-party trackers
• No account needed — ever

LANGUAGES

English and Portuguese (Brazilian).

CURRENCIES

EUR, BRL, and USD.

Built for people who want a real picture of their finances — not another app that wants their data.
```

(~1700 chars)

---

## Full description — PT (max 4000)

```
Assuma o controle do seu dinheiro sem mandar um único centavo pra nuvem.

O Zemoc é um aplicativo de controle financeiro pessoal que vive inteiramente no seu dispositivo. Acompanhe suas assinaturas, gastos e receitas — veja quanto você realmente gasta por mês, preveja como o mês vai terminar, e nunca mais se surpreenda com uma cobrança recorrente.

POR QUE O ZEMOC

• Offline de verdade. Sem conta, sem cadastro, sem sincronização com nuvem. Seus dados financeiros nunca saem do celular.
• Foco em assinaturas. A maioria dos apps trata a Netflix do mesmo jeito que trata um café. O Zemoc separa as cobranças recorrentes pra você ver o que está realmente comendo seu orçamento todo mês.
• Seus números, suas regras. Feito para quem acompanha finanças pessoais de verdade — não para contadores preenchendo planilhas.

PRINCIPAIS FUNCIONALIDADES

• Painel com saldo acumulado: "Abril terminou em +500, maio começa aí."
• Controle de assinaturas — mensais e anuais, com próxima data de cobrança
• Gasto rápido — digite "15 café" e o Zemoc categoriza pra você
• Controle de receitas — salário, freelance, bônus, investimentos e mais
• Previsão de fim de mês baseada em gastos realizados e planejados
• Top categorias e insights mostrando para onde o dinheiro realmente vai
• "Assinaturas para revisar" — sinaliza serviços que talvez valha a pena cancelar
• Navegação mensal — volte para qualquer mês passado ou futuro
• Backup e restauração em JSON e exportação CSV — seus dados sempre portáteis
• Bloqueio por PIN e biometria (Face ID, Touch ID, biometria Android)

PRIVACIDADE NO CENTRO

• Dados armazenados localmente no armazenamento seguro do dispositivo
• PIN guardado no Keychain do iOS / EncryptedSharedPreferences do Android
• Sem SDKs de análise, sem anúncios, sem rastreadores de terceiros
• Sem conta — nunca

IDIOMAS

Inglês e Português (Brasil).

MOEDAS

EUR, BRL e USD.

Feito para quem quer ver o retrato real das suas finanças — não para mais um app que quer seus dados.
```

(~1900 chars)

---

## Release notes / What's new

Para a versão 1.0.0 (ambas lojas):

- EN: `Initial release. Track subscriptions, expenses, and income — 100% offline, no account.`
- PT: `Versão inicial. Controle de assinaturas, gastos e receitas — 100% offline, sem cadastro.`

---

## Category

- **Apple App Store:** Primary = **Finance**. Secondary (opcional) = **Productivity** ou **Lifestyle**.
- **Google Play:** Category = **Finance**.

---

## Content rating / faixa etária

- **Apple:** 4+ (não há conteúdo objetável).
- **Google Play:** Completar o IARC questionnaire dentro do Play Console. Zemoc não tem violência, sexo, gambling, conteúdo gerado por usuário nem compras in-app. Resultado esperado: **Everyone / Livre**.

---

## URLs obrigatórias / opcionais

| Campo | Onde | Obrigatório? | Sugestão |
|---|---|---|---|
| Privacy policy URL | Ambas | **Sim (Google) / Sim (Apple 17+)** | `https://<seu-user>.github.io/zemoc/privacy.html` |
| Support URL | Apple | Sim | Link pra mailto ou pra um Linktree/GitHub page |
| Marketing URL | Apple | Opcional | Mesma landing page ou deixar em branco |
| Website | Google | Opcional | Mesma landing ou deixar em branco |

> **Email de suporte:** `elogia.dev@gmail.com` — já aplicado em todos os lugares (HTMLs, `app/privacy.tsx`, `app/terms.tsx`, `app/settings.tsx`, mensagens i18n). O domínio `zemoc.app` está registrado mas não está em uso ainda; quando quiser migrar para `support@zemoc.app`, é só pedir e eu atualizo os mesmos lugares.

---

## Campos administrativos

| Campo | Valor |
|---|---|
| Bundle ID (iOS) | `app.zemoc` |
| Package name (Android) | `app.zemoc` |
| Version | `1.0.0` |
| iOS Build Number | `1` (EAS auto-gerencia depois) |
| Android versionCode | `1` (EAS auto-gerencia depois) |
| Encryption declaration | Já declarado em `app.json`: `ITSAppUsesNonExemptEncryption: false` |
| Developer name | `Elogia` — aparece como "Zemoc by Elogia" nas lojas |
| Support email | `elogia.dev@gmail.com` |

---

## Screenshots (próximo passo — AINDA NÃO FEITAS)

### Apple — obrigatórias (mínimo 3, recomendo 5-8 por display):
- **iPhone 6.9"** (iPhone 16 Pro Max): **1290 × 2796**
- **iPhone 6.5"** (iPhone 11 Pro Max/XS Max): **1242 × 2688** (opcional se 6.9" for enviado, mas recomendado)
- **iPad Pro 13"** (M4, se `supportsTablet: true`): **2064 × 2752** — já marcamos tablet support no `app.json`, então iPad **é obrigatório**

### Google Play — obrigatórias:
- Phone screenshots: mínimo 2, até 8. Tamanho: **1080 × 1920** ou **1080 × 2400**
- 7" tablet: opcional
- 10" tablet: opcional (mas melhora rankeamento)
- **Feature graphic:** 1024 × 500 (obrigatório)

### Telas que sugiro capturar (5 screenshots fortes):
1. **Dashboard** com saldo + saldo anterior + próximas cobranças (o diferencial do app)
2. **Subscriptions** lista com total mensal
3. **Expenses** com o gráfico por categoria
4. **Insights** com previsão + top categorias
5. **Settings** ou lock screen do PIN (reforça privacidade)

Dica: tire as screenshots num simulador com dados de exemplo bons (não vazios nem com R$1).
