package br.ufpr.backend.services;

import br.ufpr.backend.dto.AuthResponseDTO;
import br.ufpr.backend.dto.ClienteCadastroDTO;
import br.ufpr.backend.dto.LoginDTO;
import br.ufpr.backend.models.Cliente;
import br.ufpr.backend.models.Endereco;
import br.ufpr.backend.models.Usuario;
import br.ufpr.backend.repositories.ClienteRepository;
import br.ufpr.backend.repositories.EnderecoRepository;
import br.ufpr.backend.repositories.FuncionarioRepository;
import br.ufpr.backend.repositories.UsuarioRepository;
import br.ufpr.backend.security.AuthenticatedUser;
import br.ufpr.backend.security.SessionTokenService;
import java.security.SecureRandom;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
    private static final SecureRandom RANDOM = new SecureRandom();

    private final ClienteRepository clienteRepository;
    private final EnderecoRepository enderecoRepository;
    private final FuncionarioRepository funcionarioRepository;
    private final UsuarioRepository usuarioRepository;
    private final HashService hashService;
    private final SessionTokenService tokens;
    private final EmailService emailService;

    public AuthService(
            ClienteRepository clienteRepository,
            EnderecoRepository enderecoRepository,
            FuncionarioRepository funcionarioRepository,
            UsuarioRepository usuarioRepository,
            HashService hashService,
            SessionTokenService tokens,
            EmailService emailService) {
        this.clienteRepository = clienteRepository;
        this.enderecoRepository = enderecoRepository;
        this.funcionarioRepository = funcionarioRepository;
        this.usuarioRepository = usuarioRepository;
        this.hashService = hashService;
        this.tokens = tokens;
        this.emailService = emailService;
    }

    @Transactional
    public AuthResponseDTO cadastrarCliente(ClienteCadastroDTO dto) {
        String email = normalizarEmail(dto.email());
        garantirEmailDisponivel(email);
        if (clienteRepository.findByCpf(dto.cpf()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Este CPF já está cadastrado.");
        }

        String senhaFinal = (dto.senha() == null || dto.senha().isBlank())
                ? String.format("%04d", RANDOM.nextInt(10000))
                : dto.senha();

        Usuario usuario = usuarioRepository.save(novoUsuario(dto.nome(), email, senhaFinal));
        Endereco endereco = new Endereco();
        endereco.setCep(dto.cep());
        endereco.setLogradouro(dto.logradouro().trim());
        endereco.setNumero(dto.numero().trim());
        endereco.setComplemento(dto.complemento() == null || dto.complemento().isBlank()
                ? null : dto.complemento().trim());
        endereco.setBairro(dto.bairro().trim());
        endereco.setCidade(dto.cidade().trim());
        endereco.setUf(dto.uf().trim().toUpperCase(Locale.ROOT));
        endereco = enderecoRepository.save(endereco);

        Cliente cliente = new Cliente();
        cliente.setUsuario(usuario);
        cliente.setCpf(dto.cpf());
        cliente.setTelefone(dto.telefone());
        cliente.setEndereco(endereco);
        clienteRepository.saveAndFlush(cliente);

        emailService.enviarSenhaAutocadastro(usuario.getNome(), email, senhaFinal);

        return autenticar(usuario, AuthenticatedUser.CLIENTE);
    }

    @Transactional(readOnly = true)
    public AuthResponseDTO login(LoginDTO dto) {
        String email = normalizarEmail(dto.getEmail());
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(this::credenciaisInvalidas);
        if (!Boolean.TRUE.equals(usuario.getAtivo())
                || usuario.getSenhaSalt() == null
                || usuario.getSenhaHash() == null
                || !hashService.validarSenha(dto.getSenha(), usuario.getSenhaSalt(), usuario.getSenhaHash())) {
            throw credenciaisInvalidas();
        }

        String perfil = identificarPerfil(usuario, dto.getPerfil());
        return autenticar(usuario, perfil);
    }

    public void logout(String token) {
        tokens.revoke(token);
    }

    @NonNull
    private Usuario novoUsuario(String nome, String email, String senha) {
        String salt = hashService.gerarSalt();
        Usuario usuario = new Usuario();
        usuario.setNome(nome.trim());
        usuario.setEmail(email);
        usuario.setSenhaSalt(salt);
        usuario.setSenhaHash(hashService.gerarHash(senha, salt));
        usuario.setAtivo(true);
        return usuario;
    }

    private AuthResponseDTO autenticar(Usuario usuario, String perfil) {
        AuthenticatedUser autenticado = new AuthenticatedUser(
                usuario.getId(), usuario.getNome(), usuario.getEmail(), perfil);
        SessionTokenService.IssuedToken token = tokens.issue(autenticado);
        return new AuthResponseDTO(
                usuario.getId(), usuario.getNome(), usuario.getEmail(), perfil,
                token.value(), token.expiresAt());
    }

    private String identificarPerfil(Usuario usuario, String solicitado) {
        Integer usuarioId = usuario.getId();
        if (usuarioId == null) {
            throw credenciaisInvalidas();
        }
        boolean cliente = clienteRepository.findById(usuarioId).isPresent();
        boolean funcionario = funcionarioRepository.findById(usuarioId).isPresent();
        if (solicitado == null) {
            if (cliente == funcionario) {
                throw credenciaisInvalidas();
            }
            return cliente ? AuthenticatedUser.CLIENTE : AuthenticatedUser.FUNCIONARIO;
        }
        if ((AuthenticatedUser.CLIENTE.equals(solicitado) && cliente)
                || (AuthenticatedUser.FUNCIONARIO.equals(solicitado) && funcionario)) {
            return solicitado;
        }
        throw credenciaisInvalidas();
    }

    private void garantirEmailDisponivel(String email) {
        if (usuarioRepository.findByEmail(email).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Este e-mail já está registrado.");
        }
    }

    private String normalizarEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private ResponseStatusException credenciaisInvalidas() {
        return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas.");
    }
}
