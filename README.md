# Manutenção de equipamentos

Aplicação acadêmica com Angular, Spring Boot e MySQL. Cada integrante pode
executar o sistema com seu próprio banco local.

## Estrutura em uso

| Pasta | Conteúdo |
| --- | --- |
| `Front/src` | Telas, serviços HTTP, autenticação, estilos e testes do Angular |
| `Front/public` | Imagens e recursos estáticos do frontend |
| `Back/src/main/java/br/ufpr/backend` | Backend Spring Boot |
| `Back/src/main/resources` | Configuração do backend |
| `Back/src/test` | Testes Java e recursos de teste |
| `Back/database` | Schema, dados fictícios, migração de senhas e consultas de conferência |
| `docs` | Orientações e modelo do arquivo de integrantes |
| `scripts` | Preparação do pacote de entrega |

O Angular é executado dentro de `Front`; não há um segundo projeto Angular na
raiz. O backend é executado dentro de `Back`. O código Java ativo fica no pacote
`br.ufpr.backend`.

## Preparação local

Instale Java 17 ou superior, Node.js/npm compatíveis com o Angular do projeto e
MySQL 8.0.16 ou superior. O Maven Wrapper está incluído em `Back/.mvn`.

### 1. Banco de testes

No MySQL Workbench, crie um banco vazio e selecione-o:

```sql
CREATE DATABASE manutencao_equipamento;
USE manutencao_equipamento;
```

Execute os arquivos nesta ordem:

1. `Back/database/schema.sql`
2. `Back/database/seed.sql`
3. `Back/database/verify.sql`

O schema e o seed devem ser executados apenas em banco vazio. O seed é um retrato
do banco local de 06/11/2026: 9 usuários, 6 clientes, 3 funcionários, 5 categorias,
24 solicitações e 72 eventos. Ele preserva IDs, telefones, datas, estados e as
credenciais existentes como hash e salt. Os usuários usam as mesmas senhas do
banco de origem; não há uma senha padrão para todos.

Os quatro clientes antigos (`ana@example.test`, `joao@example.test`,
`carla@example.test` e `pedro@example.test`) estavam sem senha no banco de origem
e continuam assim no seed. A migração `002_senhas_iniciais.sql` é **opcional**:
ela define `1234` para usuários sem hash, modificando essa condição do retrato.
Ela não substitui credenciais existentes. O cadastro e a edição pela aplicação
exigem pelo menos 6 caracteres.

Se importar uma exportação completa do banco de outro integrante, não execute
novamente schema, seed ou migração de senhas. Os cadastros e senhas serão os da
exportação. O Git distribui os scripts, não as alterações feitas no MySQL local.

### 2. Backend

Em um terminal PowerShell:

```powershell
cd Back
$env:SPRING_DATASOURCE_URL = 'jdbc:mysql://localhost:3306/manutencao_equipamento'
$env:SPRING_DATASOURCE_USERNAME = 'root'
$env:SPRING_DATASOURCE_PASSWORD = 'sua-senha-do-mysql'
.\mvnw.cmd spring-boot:run
```

Use as credenciais do MySQL da sua máquina. A senha da conexão com MySQL é
diferente da senha dos usuários da aplicação. As variáveis acima sobrescrevem os
valores de `application.properties`. No Linux/macOS, exporte as mesmas variáveis
e use `sh ./mvnw spring-boot:run`.

### 3. Frontend

Em outro terminal, a partir da raiz do projeto:

```powershell
cd Front
npm ci
npm start
```

Acesse `http://localhost:4200`. O proxy encaminha `/api` para o backend em
`http://localhost:8080`. O MySQL e o backend precisam estar disponíveis.

## Verificação

Na pasta `Back`:

```powershell
.\mvnw.cmd clean verify
```

Na pasta `Front`:

```powershell
npm test -- --watch=false
npm run build
```

Os testes Java usam H2 e não alteram o banco MySQL local. Para testar o fluxo
completo, faça login, abra um pedido, gere orçamento, aprove ou rejeite e confira
os estados e o histórico. As instruções de resgate, arquivamento e relatórios
estão em `docs/Entrega.md`.

## Entrega e arquivos gerados

Consulte `docs/Entrega.md` e `scripts/gerar-entrega.ps1` para montar
`Integrantes.txt`, `Fontes` e, se solicitada, `Documentacao`.

`Front/node_modules`, `Front/.angular`, `Front/dist` e `Back/target` são gerados
por instalação, build ou testes; não devem ser enviados como fontes. Mantenha
os arquivos `package-lock.json`, `pom.xml`, o Maven Wrapper, os scripts SQL e os
testes. Após apagar `Front/node_modules`, execute `npm ci` novamente.
