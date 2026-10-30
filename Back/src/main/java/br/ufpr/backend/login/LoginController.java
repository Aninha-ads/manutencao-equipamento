package br.ufpr.backend.login;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * POST /api/sessao/login  ->  200 + SessaoResponse | 400 | 401 | 403
 * Rota nova, separada de /api/auth/login, para não alterar o que já existe.
 */
@RestController
@RequestMapping("/api/sessao")
@CrossOrigin(origins = "http://localhost:4200")
public class LoginController {

    private final LoginService loginService;

    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    @PostMapping("/login")
    public ResponseEntity<SessaoResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(loginService.autenticar(request));
    }
}
