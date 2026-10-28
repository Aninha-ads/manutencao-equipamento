package br.ufpr.backend.controllers;

import br.ufpr.backend.dto.FuncionarioRequestDTO;
import br.ufpr.backend.dto.FuncionarioResponseDTO;
import br.ufpr.backend.dto.LoginDTO;
import br.ufpr.backend.services.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/cadastro")
    public ResponseEntity<FuncionarioResponseDTO> autocadastro(@Valid @RequestBody FuncionarioRequestDTO dto) {
        FuncionarioResponseDTO response = authService.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<FuncionarioResponseDTO> login(@Valid @RequestBody LoginDTO dto) {
        FuncionarioResponseDTO response = authService.login(dto);
        return ResponseEntity.ok(response);
    }
}