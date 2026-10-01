// src/app/shared/utils/hash.util.ts

/**
 * Gera um hash SHA-256 com SALT aleatório de 16 bytes.
 * Retorno no formato: "saltHex:hashHex"
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const saltHex = bytesToHex(salt);
  const hashHex = await hashComSalt(password, salt);
  return `${saltHex}:${hashHex}`;
}

/**
 Refaz o HASH usando um SALT ja existente (em hexadecimal).
 Usada na validacao do login.
 Retorna --apenas-- o HASH em HEX (sem o SALT).
 */
export async function hashPasswordComSalt(
  password: string,
  saltHex: string
): Promise<string> {
  const salt = hexToBytes(saltHex);
  return hashComSalt(password, salt);
}

// ---------- internos ----------

async function hashComSalt(password: string, salt: Uint8Array): Promise<string> {
  const encoder = new TextEncoder();
  const passwordBytes = encoder.encode(password);

  const combined = new Uint8Array(salt.length + passwordBytes.length);
  combined.set(salt, 0);
  combined.set(passwordBytes, salt.length);

  const hashBuffer = await window.crypto.subtle.digest('SHA-256', combined);
  return bytesToHex(new Uint8Array(hashBuffer));
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}