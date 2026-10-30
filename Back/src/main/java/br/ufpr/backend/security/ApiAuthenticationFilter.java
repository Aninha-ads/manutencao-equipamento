package br.ufpr.backend.security;

import br.ufpr.backend.models.Usuario;
import br.ufpr.backend.repositories.UsuarioRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class ApiAuthenticationFilter extends OncePerRequestFilter {
    public static final String USER_ATTRIBUTE = "br.ufpr.backend.security.AuthenticatedUser";

    private final SessionTokenService tokens;
    private final UsuarioRepository usuarios;

    public ApiAuthenticationFilter(SessionTokenService tokens, UsuarioRepository usuarios) {
        this.tokens = tokens;
        this.usuarios = usuarios;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        String path = request.getRequestURI();
        String method = request.getMethod();

        if (!path.startsWith(request.getContextPath() + "/api")
                || HttpMethod.OPTIONS.matches(method)
                || isPublic(method, path)) {
            filterChain.doFilter(request, response);
            return;
        }

        String authorization = request.getHeader("Authorization");
        AuthenticatedUser user = authorization != null && authorization.startsWith("Bearer ")
                ? tokens.resolve(authorization.substring(7).trim())
                : null;
        if (user == null) {
            respond(response, HttpServletResponse.SC_UNAUTHORIZED, "Autenticação necessária.");
            return;
        }
        Usuario usuario = usuarios.findById(user.id()).orElse(null);
        if (usuario == null || !Boolean.TRUE.equals(usuario.getAtivo())) {
            tokens.revoke(authorization.substring(7).trim());
            respond(response, HttpServletResponse.SC_UNAUTHORIZED, "Sessão inválida ou conta desativada.");
            return;
        }

        if (requiresEmployee(method, path)
                && !AuthenticatedUser.FUNCIONARIO.equals(user.perfil())) {
            respond(response, HttpServletResponse.SC_FORBIDDEN, "Acesso permitido somente a funcionários.");
            return;
        }

        request.setAttribute(USER_ATTRIBUTE, user);
        filterChain.doFilter(request, response);
    }

    private boolean isPublic(String method, String path) {
        return (HttpMethod.POST.matches(method)
                    && (path.endsWith("/api/auth/login")
                        || path.endsWith("/api/clientes")))
                || (HttpMethod.GET.matches(method)
                    && (path.endsWith("/api/categorias")
                        || path.matches(".*/api/categorias/\\d+")));
    }

    private boolean requiresEmployee(String method, String path) {
        return path.contains("/api/funcionarios")
                || (path.contains("/api/categorias") && !HttpMethod.GET.matches(method))
                || (path.contains("/api/clientes") && !HttpMethod.POST.matches(method));
    }

    private void respond(HttpServletResponse response, int status, String message) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write("{\"message\":\"" + message + "\"}");
    }
}
