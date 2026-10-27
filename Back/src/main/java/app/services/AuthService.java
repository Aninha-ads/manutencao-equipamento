package app.services;

import app.dto.FuncionarioRequestDTO;
import app.dto.FuncionarioResponseDTO;
import app.dto.LoginDTO;
import app.models.Funcionario;
import app.repositories.FuncionarioRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final FuncionarioRepository repository;
    private final HashService hashService;

    public AuthService(FuncionarioRepository repository, HashService hashService) {
        this.repository = repository;
        this.hashService = hashService;
    }

    public FuncionarioResponseDTO cadastrar(FuncionarioRequestDTO dto) {
        if (repository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Este e-mail já está registado.");
        }

        String salt = hashService.gerarSalt();
        String hash = hashService.gerarHash(dto.getSenha(), salt);

        Funcionario novo = new Funcionario();
        novo.setNome(dto.getNome());
        novo.setEmail(dto.getEmail());
        novo.setSalt(salt);
        novo.setSenhaHash(hash);
        // O autocadastro define o perfil base como CLIENTE
        novo.setPerfil("CLIENTE"); 
        novo.setAtivo(true);

        repository.save(novo);

        FuncionarioResponseDTO response = new FuncionarioResponseDTO();
        response.setId(novo.getId());
        response.setNome(novo.getNome());
        response.setEmail(novo.getEmail());
        response.setPerfil(novo.getPerfil());
        return response;
    }

    public FuncionarioResponseDTO login(LoginDTO dto) {
        Funcionario func = repository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Credenciais inválidas."));

        if (!func.isAtivo()) {
            throw new RuntimeException("Esta conta encontra-se desativada.");
        }

        // Valida o hash usando o salt guardado no banco
        if (!hashService.validarSenha(dto.getSenha(), func.getSalt(), func.getSenhaHash())) {
            throw new RuntimeException("Credenciais inválidas.");
        }

        FuncionarioResponseDTO response = new FuncionarioResponseDTO();
        response.setId(func.getId());
        response.setNome(func.getNome());
        response.setEmail(func.getEmail());
        response.setPerfil(func.getPerfil());
        return response;
    }
}