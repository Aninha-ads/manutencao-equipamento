# Banco de dados — versão inicial

Esta pasta contém a parte do banco da Semana 6. Foi usado PostgreSQL.

## Arquivos

- `database/schema.sql`: cria as tabelas e os estados das solicitações.
- `database/seed.sql`: insere dados fictícios com comandos INSERT.
- `database/verify.sql`: consultas simples para conferir o resultado.

## Como executar

Crie um banco vazio chamado `manutencao_equipamento` no PostgreSQL. No pgAdmin, abra a ferramenta de consultas desse banco e execute os arquivos nesta ordem:

1. `schema.sql`
2. `seed.sql`
3. `verify.sql`

Execute os dois primeiros apenas uma vez. O seed depende dos IDs gerados em um banco novo, na ordem dos cadastros. Para testar novamente, use outro banco vazio. Estes arquivos não atualizam um banco criado com a versão anterior.

## Organização das tabelas

| Tabela | O que guarda |
| --- | --- |
| usuario | Nome, e-mail e campos para as futuras credenciais |
| endereco | Endereço do cliente |
| cliente | CPF, telefone e ligação com usuário e endereço |
| funcionario | Data de nascimento e ligação com usuário |
| categoria | Tipo do equipamento |
| estado_solicitacao | Estados possíveis, como ABERTA e FINALIZADA |
| solicitacao | Pedido de manutenção e informações do atendimento |
| historico_solicitacao | Mudanças de estado de cada pedido |

O nome e o e-mail ficam em usuario para não serem repetidos em cliente e funcionario. Nas solicitações usamos os IDs, sem copiar os dados dessas tabelas. Essa separação mantém a estrutura em 3FN. O endereço mantém cidade, UF e logradouro juntos, conforme permitido no plano.

As chaves estrangeiras impedem referências a registros inexistentes e a exclusão de registros ainda utilizados. CPF e e-mail são únicos. Nesta versão, UNIQUE em campos de texto diferencia maiúsculas de minúsculas; a padronização será acrescentada depois.

## Dados de teste

São 4 clientes, 2 funcionários, 5 categorias e 20 solicitações nos oito estados. Também há 65 registros de histórico para acompanhar o caminho das solicitações. Os e-mails usam `example.test` e os dados são fictícios.

Os campos de hash e salt ficam vazios por enquanto. Esses usuários ainda não servem para login. A geração e a validação das credenciais serão feitas na Semana 8, sem guardar senhas em texto puro.

## Próximas melhorias

- Validar CPF, telefone, CEP, e-mail e campos vazios.
- Implementar o login e preencher hash e salt.
- Validar as mudanças de estado, os responsáveis e as datas do atendimento.
- Atualizar a solicitação e inserir seu histórico na mesma transação.
- Usar o campo ativo para desativar contas e categorias, com as regras de exclusão do sistema.
- Acrescentar índices conforme as consultas da API precisarem.

O arquivo verify.sql permite conferir os dados manualmente; ele não é uma suíte de testes automáticos. O projeto Spring Boot ainda será criado.
