# Backend e banco de dados

## Backend Spring Boot (INF01)

O backend usa Maven, Spring Boot 3.5.16 e Java 17 ou superior. O `pom.xml` inclui Spring Web, Spring Data JPA, Bean Validation e o driver MySQL. As versões das dependências são gerenciadas pelo Spring Boot.

O Maven Wrapper permite executar o projeto sem instalar Maven globalmente. A primeira execução precisa de internet para baixar Maven e as dependências.

Na pasta `Back`, compile e gere o JAR no PowerShell:

```powershell
.\mvnw.cmd clean verify
```

Para iniciar, prepare o banco conforme as instruções abaixo e configure as credenciais:

```powershell
$env:SPRING_DATASOURCE_USERNAME = 'root'
$env:SPRING_DATASOURCE_PASSWORD = 'sua-senha-local'
$env:SPRING_DATASOURCE_URL = 'jdbc:mysql://localhost:3306/manutencao_equipamento'
.\mvnw.cmd spring-boot:run
```

No Linux/macOS, use `sh ./mvnw clean verify` e `sh ./mvnw spring-boot:run`, com as mesmas variáveis de ambiente. A API inicia na porta 8080. As credenciais não devem ser salvas no repositório.

O build não depende de um MySQL em execução. Para iniciar a aplicação, é necessário acesso ao banco. A aplicação não cria nem altera tabelas automaticamente e não executa os scripts SQL; eles continuam sendo executados manualmente.

## Banco de dados local

Os scripts usam MySQL 8.0.16 ou superior, para que as restrições CHECK sejam aplicadas.

## Arquivos

- `database/schema.sql`: cria as tabelas e os estados das solicitações.
- `database/seed.sql`: reproduz o retrato atualizado do banco local com INSERTs e IDs explícitos.
- `database/migrations/002_senhas_iniciais.sql`: opcional; define credenciais de teste para usuários sem senha.
- `database/verify.sql`: consultas simples para conferir o resultado.

## Como executar

Crie um banco vazio chamado `manutencao_equipamento` no MySQL. No MySQL Workbench, selecione esse banco como padrão (ou execute `USE manutencao_equipamento;`) e execute os arquivos nesta ordem:

1. `schema.sql`
2. `seed.sql`
3. `verify.sql`

Execute os dois primeiros apenas uma vez. O seed preserva os IDs do banco de
origem e insere os registros na ordem das chaves estrangeiras. Para testar
novamente, use outro banco vazio. Estes arquivos não atualizam bancos existentes.

O schema usa InnoDB para aplicar as chaves estrangeiras e utf8mb4_0900_as_cs para diferenciar maiúsculas, minúsculas e acentos. A criação das tabelas faz commits implícitos no MySQL; o schema inteiro não pode ser desfeito com ROLLBACK. O seed usa uma transação para inserir os dados.

Os campos de data e hora usam TIMESTAMP(6). O seed configura a sessão em UTC para preservar os instantes dos dados originais. Nas consultas, os horários são apresentados no fuso da sessão; execute `SET time_zone = '+00:00';` para consultá-los em UTC. Datas de nascimento usam apenas `AAAA-MM-DD`.

## Organização das tabelas

| Tabela | O que guarda |
| --- | --- |
| usuario | Nome, e-mail, hash e salt das credenciais |
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

O retrato de 06/11/2026 contém 9 usuários, 6 clientes, 3 funcionários, 6 endereços,
5 categorias, 24 solicitações e 72 eventos de histórico. Inclui os cadastros e
as alterações feitos no banco local depois da massa inicial.

O seed preserva hash e salt dos usuários que já possuem credenciais. As mesmas
senhas do banco de origem continuam válidas. Os quatro clientes antigos ainda
estão sem senha, conforme o retrato. Execute a migração `002` apenas se desejar
definir a senha fictícia `1234` para os usuários sem hash; isso é opcional e
modifica essa condição dos dados copiados. Credenciais existentes são preservadas.
Consulte o roteiro completo no [README principal](../README.md).

## Próximas melhorias

- Validar CPF, telefone, CEP, e-mail e campos vazios.
- Validar as mudanças de estado, os responsáveis e as datas do atendimento.
- Atualizar a solicitação e inserir seu histórico na mesma transação.
- Usar o campo ativo para desativar contas e categorias, com as regras de exclusão do sistema.
- Acrescentar índices conforme as consultas da API precisarem.

O arquivo verify.sql permite conferir os dados manualmente; ele não é uma suíte de testes automáticos.

## Integração com o Angular

A massa de demonstração vem exclusivamente das tabelas preenchidas por `database/seed.sql`.
O frontend não cria dados iniciais nem lê clientes, funcionários, categorias ou solicitações do `localStorage`.
Dados antigos do navegador são ignorados. Não é necessário executar novamente o seed em um banco já preparado.

Com o MySQL preparado, inicie o Spring Boot conforme as instruções acima e execute `npm start` na pasta `Front`.
O proxy do Angular encaminha `/api/**` para `http://localhost:8080`. Em produção, configure o servidor para
encaminhar `/api` ao backend. O antigo JSON Server foi removido.

`GET /api/dados` reúne clientes, funcionários ativos, categorias ativas e solicitações com seus históricos.
A aplicação carrega essa resposta antes de abrir as telas e a atualiza após as gravações.
Se a API estiver indisponível, mostra um erro com a opção de tentar novamente, sem substituir o SQL por mocks.

Os endpoints `/api/clientes`, `/api/funcionarios`, `/api/categorias` e `/api/solicitacoes` recebem as gravações.
IDs novos são gerados pelo banco. Funcionários removidos são inativados, preservando as referências de solicitações.
A abertura, o resgate e a finalização de solicitações gravam o histórico na mesma transação.
Os estados retornados são os códigos da tabela `estado_solicitacao`, sem rótulos acentuados no código.

O login integrado usa `POST /api/auth/login` e emite uma sessão com token.
As telas e a API verificam o perfil; o cliente só pode alterar seus próprios pedidos.
Funcionários são cadastrados pela gestão de funcionários (`POST /api/funcionarios`)
com autenticação de funcionário. O antigo autocadastro em `/api/auth/cadastro`
não está disponível. Clientes se cadastram em `POST /api/clientes`.
A abertura usa o cliente autenticado e as ações gravam o autor no histórico.

Para validar a integração sem depender de um MySQL local, execute `.\mvnw.cmd test`.
`DadosServiceTest` executa o schema e a massa fixa `src/test/resources/dados-seed.sql`
em H2 com adaptações de sintaxe, verifica a origem dos dados,
os relacionamentos, as gravações e o histórico. Isso não substitui um teste final com o MySQL configurado.
