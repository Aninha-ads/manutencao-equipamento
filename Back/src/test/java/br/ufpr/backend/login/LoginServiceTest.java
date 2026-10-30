package br.ufpr.backend.login;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import br.ufpr.backend.models.Usuario;
import br.ufpr.backend.repositories.ClienteRepository;
import br.ufpr.backend.repositories.FuncionarioRepository;
import br.ufpr.backend.repositories.UsuarioRepository;
import br.ufpr.backend.services.HashService;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/** Teste unitário (sem banco): repositórios simulados, HashService real. */
class LoginServiceTest {

    private UsuarioRepository usuarios;
    private ClienteRepository clientes;
    private FuncionarioRepository funcionarios;
    private HashService hash;
    private LoginService service;

    @BeforeEach
    void preparar() {
        usuarios = mock(UsuarioRepository.class);
        clientes = mock(ClienteRepository.class);
        funcionarios = mock(FuncionarioRepository.class);
        hash = new HashService();
        service = new LoginService(usuarios, clientes, funcionarios, hash);
    }

    private Usuario usuario(int id, String email, String senha, boolean ativo) {
        String salt = hash.gerarSalt();
        Usuario u = new Usuario();
        u.setId(id);
        u.setNome("Fulano " + id);
        u.setEmail(email);
        u.setSenhaSalt(salt);
        u.setSenhaHash(hash.gerarHash(senha, salt));
        u.setAtivo(ativo);
        when(usuarios.findByEmail(email)).thenReturn(Optional.of(u));
        return u;
    }

    private HttpStatus statusDe(LoginRequest req) {
        ResponseStatusException e = assertThrows(ResponseStatusException.class, () -> service.autenticar(req));
        return HttpStatus.valueOf(e.getStatusCode().value());
    }

    @Test
    void clienteValidoRecebePerfilCliente() {
        usuario(1, "ana@example.test", "1234", true);
        when(clientes.existsById(1)).thenReturn(true);

        SessaoResponse r = service.autenticar(new LoginRequest("ana@example.test", "1234"));

        assertEquals(PerfilUsuario.CLIENTE, r.perfil());
        assertEquals("ana@example.test", r.email());
    }

    @Test
    void funcionarioValidoRecebePerfilFuncionario() {
        usuario(5, "maria@example.test", "1234", true);
        when(funcionarios.existsById(5)).thenReturn(true);

        SessaoResponse r = service.autenticar(new LoginRequest("maria@example.test", "1234"));

        assertEquals(PerfilUsuario.FUNCIONARIO, r.perfil());
    }

    @Test
    void emailEhNormalizadoParaMinusculoEComTrim() {
        usuario(1, "ana@example.test", "1234", true);
        when(clientes.existsById(1)).thenReturn(true);

        SessaoResponse r = service.autenticar(new LoginRequest("  ANA@Example.TEST ", "1234"));

        assertEquals(1, r.id());
    }

    @Test
    void senhaErradaRetorna401() {
        usuario(1, "ana@example.test", "1234", true);
        assertEquals(HttpStatus.UNAUTHORIZED, statusDe(new LoginRequest("ana@example.test", "9999")));
    }

    @Test
    void emailInexistenteRetorna401() {
        when(usuarios.findByEmail("x@example.test")).thenReturn(Optional.empty());
        assertEquals(HttpStatus.UNAUTHORIZED, statusDe(new LoginRequest("x@example.test", "1234")));
    }

    @Test
    void contaDesativadaRetorna403() {
        usuario(1, "ana@example.test", "1234", false);
        assertEquals(HttpStatus.FORBIDDEN, statusDe(new LoginRequest("ana@example.test", "1234")));
    }

    @Test
    void usuarioSemSenhaCadastradaRetorna401() {
        Usuario u = usuario(1, "ana@example.test", "1234", true);
        u.setSenhaHash(null);
        u.setSenhaSalt(null);
        assertEquals(HttpStatus.UNAUTHORIZED, statusDe(new LoginRequest("ana@example.test", "1234")));
    }

    @Test
    void usuarioSemClienteNemFuncionarioRetorna403() {
        usuario(9, "orfao@example.test", "1234", true);
        assertEquals(HttpStatus.FORBIDDEN, statusDe(new LoginRequest("orfao@example.test", "1234")));
    }
}
