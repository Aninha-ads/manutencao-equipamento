package br.ufpr.backend.login;

import br.ufpr.backend.models.Usuario;
import br.ufpr.backend.repositories.ClienteRepository;
import br.ufpr.backend.repositories.FuncionarioRepository;
import br.ufpr.backend.repositories.UsuarioRepository;
import br.ufpr.backend.services.HashService;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

/**
 * Login único para qualquer perfil (RF002).
 * Valida e-mail + senha (SHA-256 + salt, via HashService) e descobre se o usuário
 * é CLIENTE ou FUNCIONARIO consultando as tabelas cliente/funcionario.
 */
@Service
public class LoginService {

    static final String MSG_CREDENCIAIS = "Credenciais inválidas.";
    static final String MSG_DESATIVADA = "Esta conta encontra-se desativada.";
    static final String MSG_SEM_PERFIL = "Usuário sem perfil de acesso.";

    private final UsuarioRepository usuarios;
    private final ClienteRepository clientes;
    private final FuncionarioRepository funcionarios;
    private final HashService hashService;

    public LoginService(UsuarioRepository usuarios, ClienteRepository clientes,
                        FuncionarioRepository funcionarios, HashService hashService) {
        this.usuarios = usuarios;
        this.clientes = clientes;
        this.funcionarios = funcionarios;
        this.hashService = hashService;
    }

    @Transactional(readOnly = true)
    public SessaoResponse autenticar(LoginRequest request) {
        String email = request.email().trim().toLowerCase(Locale.ROOT);

        Usuario usuario = usuarios.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, MSG_CREDENCIAIS));

        if (!Boolean.TRUE.equals(usuario.getAtivo())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, MSG_DESATIVADA);
        }
        if (!senhaConfere(usuario, request.senha())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, MSG_CREDENCIAIS);
        }

        return new SessaoResponse(usuario.getId(), usuario.getNome(), usuario.getEmail(),
                descobrirPerfil(usuario.getId()));
    }

    private boolean senhaConfere(Usuario usuario, String senha) {
        return usuario.getSenhaSalt() != null
                && usuario.getSenhaHash() != null
                && hashService.validarSenha(senha, usuario.getSenhaSalt(), usuario.getSenhaHash());
    }

    private PerfilUsuario descobrirPerfil(Integer usuarioId) {
        if (funcionarios.existsById(usuarioId)) {
            return PerfilUsuario.FUNCIONARIO;
        }
        if (clientes.existsById(usuarioId)) {
            return PerfilUsuario.CLIENTE;
        }
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, MSG_SEM_PERFIL);
    }
}
