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

### Histórico de Alterações

- 2025-07-11: Ajustado link de navegação para "/houses" no Header do frontend para usar `to` em vez de `href`.
- 2025-07-12: Adicionada opção de tema "Floresta" com paleta personalizada.
- 2025-07-13: Adicionado campo `updateIntervalUnit` em `betting_houses` para definir se o intervalo está em segundos ou minutos.
- 2025-07-15: Ajustado componente `Card` para aplicar cores de fundo no modo escuro e evitar texto branco em fundo branco.
- 2025-07-16: Implementado serviço WebSocket no backend para envio de RTP em tempo real e adicionada página `Games` no frontend.
- 2025-07-17: WebSocket agora recarrega periodicamente as casas de aposta para detectar novas entradas sem duplicar intervalos.
- 2025-07-18: Corrigido carregamento de arquivos .proto no backend; script de build agora copia a pasta `src/proto` para `dist`.

## Estrutura de Banco de Dados

- As migrações SQL ficam em `backend/database/migrations`. Utilize essa pasta para novas alterações de esquema.

