package br.ufpr.backend.repositories;

import br.ufpr.backend.models.*;
import java.time.LocalDate;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.dao.DataIntegrityViolationException;

import static org.assertj.core.api.Assertions.*;

@DataJpaTest(properties = {
    "spring.jpa.hibernate.ddl-auto=none",
    "spring.sql.init.mode=always",
    "spring.sql.init.schema-locations=classpath:usuarios-schema.sql"
})
class UsuariosRepositoriesTest {
    @Autowired private UsuarioRepository usuarios;
    @Autowired private EnderecoRepository enderecos;
    @Autowired private ClienteRepository clientes;
    @Autowired private FuncionarioRepository funcionarios;
    @Autowired private TestEntityManager entityManager;

    @Test
    void salvaClienteComIdDoUsuarioERecuperaRelacionamentos() {
        Usuario usuario = usuario("cliente@exemplo.com");
        Endereco endereco = endereco();
        Cliente salvo = clientes.saveAndFlush(cliente(usuario, endereco, "52998224725"));
        assertThat(salvo.getId()).isEqualTo(usuario.getId());
        entityManager.clear();

        Cliente encontrado = clientes.findByCpf("52998224725").orElseThrow();
        assertThat(encontrado.getUsuario().getEmail()).isEqualTo("cliente@exemplo.com");
        assertThat(encontrado.getEndereco().getUf()).isEqualTo("PR");
        assertThat(encontrado.getEndereco().getCep()).isEqualTo("01234567");
        assertThat(clientes.findByUsuarioEmail("cliente@exemplo.com")).isPresent();
        assertThat(clientes.findByCpf("00000000000")).isEmpty();
        assertThat(usuarios.findByEmail("cliente@exemplo.com")).isPresent();
    }

    @Test
    void salvaFuncionarioEConsultaSomenteAtivos() {
        Usuario ativo = usuario("ativo@exemplo.com");
        Usuario inativo = usuario("inativo@exemplo.com");
        inativo.setAtivo(false);
        funcionarios.saveAndFlush(funcionario(ativo));
        funcionarios.saveAndFlush(funcionario(inativo));
        entityManager.clear();

        Funcionario encontrado = funcionarios.findByUsuarioEmail("ativo@exemplo.com").orElseThrow();
        assertThat(encontrado.getId()).isEqualTo(ativo.getId());
        assertThat(encontrado.getDataNascimento()).isEqualTo(LocalDate.of(1995, 3, 12));
        assertThat(funcionarios.findByUsuarioAtivoTrue()).extracting(Funcionario::getId)
            .containsExactly(ativo.getId());
        assertThat(funcionarios.findByUsuarioEmail("ausente@exemplo.com")).isEmpty();
    }

    @Test
    void atualizaEConsultaDadosPersistidos() {
        Cliente cliente = clientes.saveAndFlush(cliente(usuario("editar@exemplo.com"), endereco(), "11144477735"));
        Integer id = cliente.getId();
        entityManager.clear();
        Cliente encontrado = clientes.findById(id).orElseThrow();
        encontrado.setTelefone("41999990002");
        clientes.saveAndFlush(encontrado);
        entityManager.clear();
        assertThat(clientes.findById(id).orElseThrow().getTelefone()).isEqualTo("41999990002");
    }

    @Test
    void rejeitaEmailDuplicado() {
        usuario("duplicado@exemplo.com");
        assertThatThrownBy(() -> usuario("duplicado@exemplo.com"))
            .isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    void rejeitaCpfDuplicado() {
        clientes.saveAndFlush(cliente(usuario("primeiro@exemplo.com"), endereco(), "52998224725"));
        Usuario segundo = usuario("segundo@exemplo.com");
        Endereco outroEndereco = endereco();
        assertThatThrownBy(() -> clientes.saveAndFlush(cliente(segundo, outroEndereco, "52998224725")))
            .isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    void impedeDoisClientesNoMesmoEndereco() {
        Endereco endereco = endereco();
        clientes.saveAndFlush(cliente(usuario("primeiro@exemplo.com"), endereco, "52998224725"));
        Usuario segundo = usuario("segundo@exemplo.com");
        assertThatThrownBy(() -> clientes.saveAndFlush(cliente(segundo, endereco, "11144477735")))
            .isInstanceOf(DataIntegrityViolationException.class);
    }

    private Usuario usuario(String email) {
        Usuario usuario = new Usuario();
        usuario.setNome("Pessoa de teste");
        usuario.setEmail(email);
        return usuarios.saveAndFlush(usuario);
    }

    private Endereco endereco() {
        Endereco endereco = new Endereco();
        endereco.setCep("01234567");
        endereco.setLogradouro("Rua de teste");
        endereco.setNumero("10A");
        endereco.setBairro("Centro");
        endereco.setCidade("Curitiba");
        endereco.setUf("PR");
        return enderecos.saveAndFlush(endereco);
    }

    private Cliente cliente(Usuario usuario, Endereco endereco, String cpf) {
        Cliente cliente = new Cliente();
        cliente.setUsuario(usuario);
        cliente.setEndereco(endereco);
        cliente.setCpf(cpf);
        cliente.setTelefone("41999990001");
        return cliente;
    }

    private Funcionario funcionario(Usuario usuario) {
        Funcionario funcionario = new Funcionario();
        funcionario.setUsuario(usuario);
        funcionario.setDataNascimento(LocalDate.of(1995, 3, 12));
        return funcionario;
    }
}
