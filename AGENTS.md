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

## Estrutura de Banco de Dados

- As migrações SQL ficam em `backend/database/migrations`. Utilize essa pasta para novas alterações de esquema.

