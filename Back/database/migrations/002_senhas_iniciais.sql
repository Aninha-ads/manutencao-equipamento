-- Define a senha de teste "1234" para os usuários do seed que ainda não têm senha.
-- Usa o MESMO algoritmo do HashService: hash = Base64( SHA-256( salt_bytes + senha ) ).
-- Executar depois de schema.sql e seed.sql (MySQL 8). Pode rodar de novo sem efeito colateral.
-- Apenas para dados fictícios de teste.

-- 1) um salt aleatório (16 bytes em Base64) para cada usuário sem senha
UPDATE usuario
   SET senha_salt = TO_BASE64(RANDOM_BYTES(16))
 WHERE senha_hash IS NULL;

-- 2) hash da senha de teste usando o salt acima
UPDATE usuario
   SET senha_hash = TO_BASE64(UNHEX(SHA2(CONCAT(FROM_BASE64(senha_salt), '1234'), 256)))
 WHERE senha_hash IS NULL
   AND senha_salt IS NOT NULL;

-- Conferência: deve listar 6 usuários, todos com salt (24 caracteres) e hash (44 caracteres)
SELECT u.email,
       CASE WHEN f.usuario_id IS NOT NULL THEN 'FUNCIONARIO' ELSE 'CLIENTE' END AS perfil,
       CHAR_LENGTH(u.senha_salt) AS tam_salt,
       CHAR_LENGTH(u.senha_hash) AS tam_hash
  FROM usuario u
  LEFT JOIN funcionario f ON f.usuario_id = u.id
 ORDER BY u.id;
