# Preparação da entrega

O material informado exige um arquivo texto com nome completo, GRR e e-mail de
cada integrante, além da subpasta `Fontes` com os fontes do projeto.
`Documentacao` só deve ser incluída se o professor tiver solicitado artefatos
adicionais, reunidos em um arquivo `.doc` ou `.odt`. Os PDFs de receitas são
saídas do sistema, não substituem essa documentação acadêmica.

1. Copie `docs/Integrantes-modelo.txt` para um arquivo de trabalho e substitua a
   linha de exemplo pelos integrantes reais, um por linha, separados por `;`.
   Não use nomes, GRRs ou e-mails inventados na entrega.
2. Na raiz do repositório, valide os dados:

   ```powershell
   .\scripts\gerar-entrega.ps1 -Integrantes 'caminho\Integrantes.txt' -ValidarSomente
   ```

3. Gere a pasta de entrega e o ZIP:

   ```powershell
   .\scripts\gerar-entrega.ps1 -Integrantes 'caminho\Integrantes.txt'
   ```

   Somente se houver documentação adicional exigida:

   ```powershell
   .\scripts\gerar-entrega.ps1 -Integrantes 'caminho\Integrantes.txt' -Documentacao 'caminho\Artefatos.odt'
   ```

O resultado fica em `entrega/<data-hora>/`, sem modificar a organização do
repositório de desenvolvimento:

```text
Integrantes.txt
Fontes/
  Back/
  Front/
  ... demais fontes e arquivos de configuração do projeto
Documentacao/             # somente se fornecida
  Artefatos.odt           # ou .doc
```

O script inclui os arquivos atuais, inclusive alterações ainda não commitadas,
das pastas de fontes. Exclui dependências instaladas, caches e arquivos de build.
Inclui os scripts SQL de `Back/database`; o seed reproduz o retrato do banco local
capturado em 06/11/2026, incluindo as credenciais armazenadas como hash e salt.
Alterações feitas depois dessa captura exigem uma nova atualização do seed ou
uma exportação separada pelo MySQL Workbench.

Antes de enviar, confira os integrantes e extraia o ZIP para verificar se contém
`Back/.mvn`, `Back/mvnw.cmd`, `Back/pom.xml`, `Front/package.json`,
`Front/package-lock.json`, os fontes, os recursos e os scripts SQL. O avaliador
precisa reinstalar as dependências e preparar o MySQL local para executar.

## Roteiro de revisão funcional

- Cliente: rejeitar um orçamento, abrir **Resgatar Serviço**, conferir o valor e
  confirmar. O estado deve passar de `REJEITADA` para `APROVADA`, com novo evento
  no histórico e preservação do orçamento.
- Funcionário: em **Solicitações de Serviço**, filtrar `REJEITADA` e escolher
  **Devolver e arquivar**. O pedido passa a `FINALIZADA`, sem pagamento ou reparo.
  O cliente não pode resgatá-lo depois. A ação também está nos detalhes.
- Relatórios: gerar PDF por período e por categoria. Pedidos pagos e finalizados
  que passaram por pagamento entram uma única vez; rejeitados arquivados sem
  pagamento ficam fora. Conferir datas, valores, total e categorias extensas.

Os dados pessoais reais da equipe ainda precisam ser fornecidos; o arquivo
modelo não é uma relação final de integrantes.
