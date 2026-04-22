# meu-app

Projeto Expo (React Native) iniciado em 2026-04-22, destinado a publicação em **App Store** (iOS) e **Google Play** (Android).

## Stack

- **Expo SDK** com template `default` (Expo Router, TypeScript, ESLint)
- **React Native** — runtime
- **Expo Router** — navegação baseada em arquivos em [app/](app/)
- **EAS Build / EAS Submit** — build e publicação nas lojas (nuvem, não precisa Xcode local no dia a dia)
- Node.js gerenciado por **nvm** (LTS atual: v24)

## Perfil do usuário

Iniciante, pouca experiência prévia em programação. Ao explicar:
- Prefira passo a passo, comandos completos prontos para copiar
- Explique **por que** antes de **como** quando introduzir conceitos novos
- Evite jargão sem contextualizar

## Como rodar localmente

```bash
cd "/Users/francisconi/Documents/Apps Claude/meu-app"
npx expo start
```

Abra o app **Expo Go** no celular (iOS ou Android) e escaneie o QR code do terminal. Mudanças no código recarregam no celular em tempo real.

## Estrutura

- `app/` — telas e navegação (Expo Router: cada arquivo vira uma rota)
- `components/` — componentes reutilizáveis
- `hooks/` — custom React hooks
- `constants/` — constantes (cores, temas)
- `assets/` — imagens, ícones, fontes
- `app.json` — configuração do app (nome, ícone, bundle identifier)

## Publicação (quando chegar a hora)

1. Apple Developer Program ativo (US$ 99/ano) + Google Play Console (US$ 25 único)
2. `eas build --platform ios` e `eas build --platform android` — compila na nuvem
3. `eas submit` — envia para App Store Connect / Google Play
