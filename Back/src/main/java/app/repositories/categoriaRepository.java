package br.ufpr.backend.repositories;

import br.ufpr.backend.models.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CategoriaRepository extends JpaRepository {
    List findByAtivoTrue();
}