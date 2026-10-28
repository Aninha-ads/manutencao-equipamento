package br.ufpr.backend.services;

import br.ufpr.backend.dto.FuncionarioRequestDTO;
import br.ufpr.backend.dto.FuncionarioResponseDTO;
import br.ufpr.backend.dto.LoginDTO;
import br.ufpr.backend.models.Funcionario;
import br.ufpr.backend.models.Usuario;
import br.ufpr.backend.repositories.FuncionarioRepository;
import br.ufpr.backend.repositories.UsuarioRepository;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final FuncionarioRepository funcionarioRepository;
    private final UsuarioRepository usuarioRepository;
    private final HashService hashService;

    public AuthService(
            FuncionarioRepository funcionarioRepository,
            UsuarioRepository usuarioRepository,
            HashService hashService) {
        this.funcionarioRepository = funcionarioRepository;
        this.usuarioRepository = usuarioRepository;
        this.hashService = hashService;
    }

    @Transactional
    public FuncionarioResponseDTO cadastrar(FuncionarioRequestDTO dto) {
        String email = dto.getEmail().trim().toLowerCase(Locale.ROOT);
        if (usuarioRepository.findByEmail(email).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Este e-mail já está registrado.");
        }

        String salt = hashService.gerarSalt();
        String hash = hashService.gerarHash(dto.getSenha(), salt);

        Usuario usuario = new Usuario();
        usuario.setNome(dto.getNome());
        usuario.setEmail(email);
        usuario.setSenhaSalt(salt);
        usuario.setSenhaHash(hash);
        usuario.setAtivo(true);
        usuario = usuarioRepository.save(usuario);

        Funcionario novo = new Funcionario();
        novo.setUsuario(usuario);
        novo.setDataNascimento(dto.getDataNascimento());
        novo = funcionarioRepository.save(novo);

        return resposta(novo);
    }

    public FuncionarioResponseDTO login(LoginDTO dto) {
        String email = dto.getEmail().trim().toLowerCase(Locale.ROOT);
        Funcionario func = funcionarioRepository.findByUsuarioEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas."));

        Usuario usuario = func.getUsuario();
        if (!usuario.getAtivo()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Esta conta encontra-se desativada.");
        }

        if (usuario.getSenhaSalt() == null || usuario.getSenhaHash() == null
                || !hashService.validarSenha(dto.getSenha(), usuario.getSenhaSalt(), usuario.getSenhaHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas.");
        }

        return resposta(func);
    }

    private FuncionarioResponseDTO resposta(Funcionario funcionario) {
        Usuario usuario = funcionario.getUsuario();
        FuncionarioResponseDTO response = new FuncionarioResponseDTO();
        response.setId(funcionario.getId());
        response.setNome(usuario.getNome());
        response.setEmail(usuario.getEmail());
        response.setPerfil("FUNCIONARIO");
        return response;
    }
}