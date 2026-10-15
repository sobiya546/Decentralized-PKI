// Cryptographic and Mock Data Utilities for NexDPKI

/**
 * Generates a realistic mock SHA-256 fingerprint in colon-separated hex format
 */
export function generateFingerprint(seed = '') {
  const chars = '0123456789ABCDEF';
  let hash = '';
  // Generate 32 bytes (64 hex characters)
  for (let i = 0; i < 32; i++) {
    const byte = chars[Math.floor(Math.random() * chars.length)] + chars[Math.floor(Math.random() * chars.length)];
    hash += (i === 0 ? '' : ':') + byte;
  }
  return hash;
}

/**
 * Generates a mock certificate serial number (hex string)
 */
export function generateSerialNumber() {
  const chars = '0123456789ABCDEF';
  let serial = '';
  for (let i = 0; i < 16; i++) {
    serial += chars[Math.floor(Math.random() * chars.length)];
  }
  return serial;
}

/**
 * Generates a realistic mock PEM format X.509 certificate string
 */
export function generateMockPEM(subject, issuer, serial, fingerprint) {
  const rawBase64Sample = [
    'MIIEkjCCA3qgAwIBAgIU' + serial.slice(0, 8),
    'MA0GCSqGSIb3DQEBCwUA' + btoa(issuer).slice(0, 16) + 'MRUwEwYDVQQDDAxOZXhEUEtJ',
    'MCAXDTI2MDEwMTAwMDAwMFoYDzIwNDYwMTAxMDAwMDAwWjBBMQswCQYDVQQGEwJV',
    'UzEUMBIGA1UECgwLTmV4RFBLSS1GZWQxGTAXBgNVBAMMEE' + btoa(subject).slice(0, 12),
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAy' + serial.slice(8) + 'pLq',
    '3FqYQ7W3V3UqJmK9vN2m1L4k8j7H6g5F4d3S2a1P9o8I7u6Y5t4R3e2W1q0Z8x7c',
    'v6b5n4m3l2k1j0h9g8f7e6d5c4b3a2Z1Y0X9W8V7U6T5S4R3Q2P1O0N9M8L7K6J5',
    'I4H3G2F1E0D9C8B7A6a5b4c3d2e1f0g9h8i7j6k5l4m3n2o1p0q9r8s7t6u5v4w3',
    'x2y1z0123456789ABCDEF+/==',
  ].join('\n');

  return `-----BEGIN CERTIFICATE-----
${rawBase64Sample}
-----END CERTIFICATE-----`;
}

/**
 * Formats ISO date into human-readable string
 */
export function formatDate(isoString) {
  if (!isoString) return 'N/A';
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return isoString;
  }
}

/**
 * Formats ISO date into date + time
 */
export function formatDateTime(isoString) {
  if (!isoString) return 'N/A';
  try {
    const d = new Date(isoString);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  } catch {
    return isoString;
  }
}

/**
 * Computes remaining days until expiry
 */
export function getDaysRemaining(expiryIso) {
  if (!expiryIso) return 0;
  const now = new Date();
  const expiry = new Date(expiryIso);
  const diffTime = expiry - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
