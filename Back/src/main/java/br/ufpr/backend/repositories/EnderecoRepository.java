package br.ufpr.backend.repositories;

import br.ufpr.backend.models.Endereco;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnderecoRepository extends JpaRepository<Endereco, Integer> {}
