package app.repositories;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.ufpr.backend.models.Solicitacao;

@Repository
public interface RelatorioRepository extends JpaRepository<Solicitacao, Integer> {

    // Soma os valores recebidos, agrupados pela data do pagamento.
    @Query(value = """
        SELECT
            DATE(s.data_hora_pagamento) AS data_pagamento,
            SUM(s.valor_orcado) AS total
        FROM solicitacao s
        WHERE s.estado = 'PAGA'
          AND s.data_hora_pagamento IS NOT NULL
          AND (:inicio IS NULL OR DATE(s.data_hora_pagamento) >= :inicio)
          AND (:fim IS NULL OR DATE(s.data_hora_pagamento) <= :fim)
        GROUP BY DATE(s.data_hora_pagamento)
        ORDER BY DATE(s.data_hora_pagamento)
        """, nativeQuery = true)
    List<Object[]> buscarReceitasPorPeriodo(
            @Param("inicio") LocalDate inicio,
            @Param("fim") LocalDate fim
    );

    // Soma os valores recebidos, agrupados pelo nome da categoria.
    @Query(value = """
        SELECT
            c.nome AS categoria,
            SUM(s.valor_orcado) AS total
        FROM solicitacao s
        INNER JOIN categoria c ON c.id = s.categoria_id
        WHERE s.estado = 'PAGA'
        GROUP BY c.id, c.nome
        ORDER BY c.nome
        """, nativeQuery = true)
    List<Object[]> buscarReceitasPorCategoria();
}
