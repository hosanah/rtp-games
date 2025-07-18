## Lista de Agentes

- **Codex**: automação de melhorias no código, geração de documentação e manutenção.

## Funções e Comportamentos

- Atualizar dependências, corrigir bugs e implementar melhorias conforme solicitado.
- Gerenciar e manter consistência entre frontend React e backend Node.
- Executar testes e lint sempre que possível antes de finalizar mudanças.
- Novas criações devem seguir o padrão de tema com provedor `useTheme` e `ThemeToggle`.
- Evitar duplicar componentes de layout; as páginas que já são embrulhadas pelo
  `Layout` nas rotas não devem importá-lo novamente. Isso previne headers
  duplicados.
- O hook `useRtpSocket` deve reconectar automaticamente com backoff exponencial caso o WebSocket feche inesperadamente.

- Listagens de jogos das casas devem vir do serviço WebSocket (`useRtpSocket`),
  não via requisições REST para `/games/house`.

- A variável `VERIFY_SSL` controla a validação de certificados nas requisições HTTPS.
  Desative (`VERIFY_SSL=false`) apenas em desenvolvimento para evitar riscos de segurança.


### Histórico de Alterações

- 2025-07-11: Ajustado link de navegação para "/houses" no Header do frontend para usar `to` em vez de `href`.
- 2025-07-12: Adicionada opção de tema "Floresta" com paleta personalizada.
- 2025-07-13: Adicionado campo `updateIntervalUnit` em `betting_houses` para definir se o intervalo está em segundos ou minutos.
- 2025-07-15: Ajustado componente `Card` para aplicar cores de fundo no modo escuro e evitar texto branco em fundo branco.
- 2025-07-16: Implementado serviço WebSocket no backend para envio de RTP em tempo real e adicionada página `Games` no frontend.
- 2025-07-17: WebSocket agora recarrega periodicamente as casas de aposta para detectar novas entradas sem duplicar intervalos.
- 2025-07-18: Corrigido carregamento de arquivos .proto no backend; script de build agora copia a pasta `src/proto` para `dist`.
- 2025-07-19: Adicionados filtros de jogos por nome, provedor e RTP positivo/negativo na página `Games`.
- 2025-07-20: WebSocket envia casas e jogos na inicialização e Games consome dados do socket.
- 2025-07-21: `useRtpSocket` agora reconecta automaticamente com backoff exponencial e limpa timers ao desmontar.

## Estrutura de Banco de Dados

- As migrações SQL ficam em `backend/database/migrations`. Utilize essa pasta para novas alterações de esquema.

