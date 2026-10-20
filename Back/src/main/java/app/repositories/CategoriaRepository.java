
package app.repositories;
import org.springframework.data.jpa.repository.JpaRepository;

import br.ufpr.backend.models.Categoria;

public interface CategoriaRepository
        extends JpaRepository<Categoria, Integer> {
}
