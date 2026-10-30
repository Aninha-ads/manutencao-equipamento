package br.ufpr.backend.login;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.server.ResponseStatusException;

/** Teste da camada HTTP sem subir o contexto Spring nem o banco. */
class LoginControllerTest {

    private LoginService service;
    private MockMvc mvc;

    @BeforeEach
    void preparar() {
        service = mock(LoginService.class);
        mvc = MockMvcBuilders.standaloneSetup(new LoginController(service)).build();
    }

    private org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder login(String json) {
        return post("/api/sessao/login").contentType(MediaType.APPLICATION_JSON).content(json);
    }

    @Test
    void loginValidoRetorna200ComPerfil() throws Exception {
        when(service.autenticar(any())).thenReturn(
                new SessaoResponse(1, "Ana Silva", "ana@example.test", PerfilUsuario.CLIENTE));

        mvc.perform(login("{\"email\":\"ana@example.test\",\"senha\":\"1234\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.perfil").value("CLIENTE"))
                .andExpect(jsonPath("$.senhaHash").doesNotExist());
    }

    @Test
    void credenciaisInvalidasRetorna401() throws Exception {
        when(service.autenticar(any())).thenThrow(
                new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas."));

        mvc.perform(login("{\"email\":\"ana@example.test\",\"senha\":\"0000\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void emailInvalidoRetorna400() throws Exception {
        mvc.perform(login("{\"email\":\"nao-e-email\",\"senha\":\"1234\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void senhaEmBrancoRetorna400() throws Exception {
        mvc.perform(login("{\"email\":\"ana@example.test\",\"senha\":\"\"}"))
                .andExpect(status().isBadRequest());
    }
}
