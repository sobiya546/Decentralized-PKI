import { generateFingerprint, generateSerialNumber, generateMockPEM } from '../utils/cryptoUtils';

export const INITIAL_ORGANIZATIONS = [
  {
    id: 'ORG-APEX-01',
    name: 'Apex University',
    shortName: 'Apex',
    domain: 'apex.edu',
    type: 'Academic & Research Trust Anchor',
    fingerprint: 'SHA256:7D:3B:84:F1:C9:22:A8:61:E0:45:9F:88:B1:0C:4E:93:8A:2F:5D:71:03:EE:9B:4C:66:81:90:3A:D4:55:1A:2B',
    trustScore: 98,
    trustStatus: 'active', // 'active' | 'pending' | 'suspended'
    registrationDate: '2024-03-15T09:30:00Z',
    nodesCount: 14,
    contactEmail: 'pki-authority@apex.edu',
    consensusWeight: '20%',
    algorithm: 'Ed25519-DPKI',
    location: 'Cambridge, MA',
    description: 'Leading higher education consortium anchor providing sovereign academic identity credentials and collaborative research cryptographic verifications.'
  },
  {
    id: 'ORG-NOVA-02',
    name: 'Nova Research Labs',
    shortName: 'Nova Labs',
    domain: 'novalabs.org',
    type: 'Quantum & Advanced AI Institute',
    fingerprint: 'SHA256:2A:9C:1F:B4:73:80:D6:55:A1:33:48:E2:B9:9D:61:74:0F:1A:7C:9B:D3:52:84:E1:90:77:33:AA:B4:C8:51:79',
    trustScore: 95,
    trustStatus: 'active',
    registrationDate: '2024-05-20T11:15:00Z',
    nodesCount: 9,
    contactEmail: 'security-mesh@novalabs.org',
    consensusWeight: '18%',
    algorithm: 'RSA-4096-PSS',
    location: 'Geneva, Switzerland',
    description: 'Specialized deep-tech and quantum research facility federating post-quantum key exchanges and high-clearance research credentials.'
  },
  {
    id: 'ORG-SEC-03',
    name: 'SecureBank Technologies',
    shortName: 'SecureBank',
    domain: 'securebank.tech',
    type: 'Fintech & Clearing Consortium',
    fingerprint: 'SHA256:E8:44:0B:71:39:AA:6C:54:19:D2:77:F0:48:CE:5B:3D:20:91:AA:FF:83:B6:5D:C2:14:0E:66:47:3B:5A:19:40',
    trustScore: 99,
    trustStatus: 'active',
    registrationDate: '2024-01-10T08:00:00Z',
    nodesCount: 22,
    contactEmail: 'ca-admin@securebank.tech',
    consensusWeight: '25%',
    algorithm: 'ECDSA-P384',
    location: 'London, UK',
    description: 'Institutional banking and clearing entity enforcing zero-trust cross-organizational settlement identity tokens and HSM root anchors.'
  },
  {
    id: 'ORG-CLD-04',
    name: 'CloudBridge Systems',
    shortName: 'CloudBridge',
    domain: 'cloudbridge.io',
    type: 'Mesh Infrastructure & Cloud Fabric',
    fingerprint: 'SHA256:55:F1:C8:30:A7:62:B9:4D:21:8E:90:3A:4C:E6:B5:12:87:60:DC:14:A2:3B:F9:7E:65:C3:28:91:A0:0B:44:88',
    trustScore: 92,
    trustStatus: 'active',
    registrationDate: '2024-08-01T14:45:00Z',
    nodesCount: 18,
    contactEmail: 'trust-fabric@cloudbridge.io',
    consensusWeight: '17%',
    algorithm: 'Ed25519-DPKI',
    location: 'San Francisco, CA',
    description: 'Zero-trust decentralized edge mesh routing verified identity attestations across hybrid multi-cloud deployments.'
  },
  {
    id: 'ORG-GOV-05',
    name: 'Digital Government Services',
    shortName: 'DigitalGov',
    domain: 'digitalgov.gov',
    type: 'Sovereign Public Sector Authority',
    fingerprint: 'SHA256:91:7E:44:22:A0:6B:5C:38:D9:11:04:EF:83:5A:BC:21:54:33:DE:70:99:A8:12:F4:60:8C:31:7A:B2:99:E1:05',
    trustScore: 100,
    trustStatus: 'active',
    registrationDate: '2023-11-04T10:00:00Z',
    nodesCount: 35,
    contactEmail: 'root-trust@digitalgov.gov',
    consensusWeight: '20%',
    algorithm: 'RSA-4096-PSS',
    location: 'Washington, D.C.',
    description: 'Public sector root compliance and cross-border identity registry providing legal assurance and compliance attestations.'
  },
  {
    id: 'ORG-CYB-06',
    name: 'CyberShield Defense Systems',
    shortName: 'CyberShield',
    domain: 'cybershield.net',
    type: 'Defense Contractor & Threat Intel',
    fingerprint: 'SHA256:B3:11:8A:F7:55:40:99:C2:10:E6:74:2A:3B:C9:80:41:E8:22:90:FA:7D:66:44:B1:83:52:19:6D:77:AA:0E:3C',
    trustScore: 48,
    trustStatus: 'suspended',
    registrationDate: '2024-09-12T16:20:00Z',
    nodesCount: 6,
    contactEmail: 'soc@cybershield.net',
    consensusWeight: '0%',
    algorithm: 'ECDSA-P384',
    location: 'Reston, VA',
    description: 'Isolated defense identity node currently suspended pending automated cryptographic audit after key rotation timeout.'
  }
];

export const INITIAL_TRUST_RELATIONSHIPS = [
  {
    id: 'REL-001',
    sourceOrgId: 'ORG-APEX-01',
    targetOrgId: 'ORG-NOVA-02',
    status: 'active', // 'active' | 'pending' | 'suspended'
    trustScore: 96,
    protocol: 'Decentralized-PKI-v2.4',
    establishedDate: '2024-05-25T10:00:00Z',
    mutualVerification: true,
    policyScope: 'Academic & Quantum Research Sharing'
  },
  {
    id: 'REL-002',
    sourceOrgId: 'ORG-APEX-01',
    targetOrgId: 'ORG-GOV-05',
    status: 'active',
    trustScore: 99,
    protocol: 'Sovereign-DID-Mesh',
    establishedDate: '2024-03-20T12:00:00Z',
    mutualVerification: true,
    policyScope: 'Accreditation & Federal Grants Verification'
  },
  {
    id: 'REL-003',
    sourceOrgId: 'ORG-NOVA-02',
    targetOrgId: 'ORG-CLD-04',
    status: 'active',
    trustScore: 94,
    protocol: 'ZeroTrust-Mesh-TLS',
    establishedDate: '2024-08-15T09:00:00Z',
    mutualVerification: true,
    policyScope: 'Compute Cluster Identity Federation'
  },
  {
    id: 'REL-004',
    sourceOrgId: 'ORG-SEC-03',
    targetOrgId: 'ORG-GOV-05',
    status: 'active',
    trustScore: 99,
    protocol: 'Financial-Compliance-BFT',
    establishedDate: '2024-02-01T15:30:00Z',
    mutualVerification: true,
    policyScope: 'AML / Sovereign Identity Exchange'
  },
  {
    id: 'REL-005',
    sourceOrgId: 'ORG-SEC-03',
    targetOrgId: 'ORG-CLD-04',
    status: 'active',
    trustScore: 91,
    protocol: 'TLS-DPoP-Mutual',
    establishedDate: '2024-08-10T11:20:00Z',
    mutualVerification: true,
    policyScope: 'Encrypted Cloud Storage & Audit Relays'
  },
  {
    id: 'REL-006',
    sourceOrgId: 'ORG-APEX-01',
    targetOrgId: 'ORG-SEC-03',
    status: 'pending',
    trustScore: 78,
    protocol: 'Fintech-Identity-Bridge',
    establishedDate: '2024-10-01T08:45:00Z',
    mutualVerification: false,
    policyScope: 'Student Tuition & Grant Settlement Federation'
  },
  {
    id: 'REL-007',
    sourceOrgId: 'ORG-CLD-04',
    targetOrgId: 'ORG-CYB-06',
    status: 'suspended',
    trustScore: 35,
    protocol: 'Defense-Gateway-v1',
    establishedDate: '2024-09-15T14:10:00Z',
    mutualVerification: false,
    policyScope: 'Critical Infrastructure Log Telemetry'
  }
];

export const INITIAL_FEDERATED_IDENTITIES = [
  {
    id: 'did:dpki:apex:user:elena.rostova',
    name: 'Dr. Elena Rostova',
    email: 'e.rostova@apex.edu',
    title: 'Lead Quantum Cryptographer',
    homeOrgId: 'ORG-APEX-01',
    targetOrgId: 'ORG-NOVA-02',
    requestedScope: 'Quantum-Simulator:Execute, High-Compute:Cluster-3',
    status: 'approved', // 'approved' | 'pending' | 'rejected'
    requestDate: '2026-09-10T14:00:00Z',
    approvedDate: '2026-09-11T09:12:00Z',
    expiryDate: '2027-09-11T09:12:00Z',
    dpkiTokenId: 'TOK-FED-99824-A',
    verificationStatus: 'Verified (Mutual Trust)',
    assuranceLevel: 'LoA-4 (Multi-Party Cryptographic)'
  },
  {
    id: 'did:dpki:nova:user:marcus.vance',
    name: 'Marcus Vance',
    email: 'm.vance@novalabs.org',
    title: 'Principal Systems Architect',
    homeOrgId: 'ORG-NOVA-02',
    targetOrgId: 'ORG-CLD-04',
    requestedScope: 'Mesh-Routing:Admin, Node-Telemetry:Read',
    status: 'approved',
    requestDate: '2026-09-15T11:20:00Z',
    approvedDate: '2026-09-15T13:40:00Z',
    expiryDate: '2027-03-15T13:40:00Z',
    dpkiTokenId: 'TOK-FED-33104-C',
    verificationStatus: 'Verified (Valid Key Proof)',
    assuranceLevel: 'LoA-3 (Hardware Token Required)'
  },
  {
    id: 'did:dpki:sec:user:sarah.chen',
    name: 'Sarah Chen, CFA',
    email: 's.chen@securebank.tech',
    title: 'Head of Settlement Security',
    homeOrgId: 'ORG-SEC-03',
    targetOrgId: 'ORG-GOV-05',
    requestedScope: 'Sovereign-Audit:Read, Compliance-Sign:Submit',
    status: 'approved',
    requestDate: '2026-09-18T08:30:00Z',
    approvedDate: '2026-09-19T10:00:00Z',
    expiryDate: '2027-09-19T10:00:00Z',
    dpkiTokenId: 'TOK-FED-48192-S',
    verificationStatus: 'Verified (Sovereign Endorsed)',
    assuranceLevel: 'LoA-4 (Institutional Root)'
  },
  {
    id: 'did:dpki:apex:user:jonas.muller',
    name: 'Jonas Müller',
    email: 'j.muller@apex.edu',
    title: 'Fintech Research Fellow',
    homeOrgId: 'ORG-APEX-01',
    targetOrgId: 'ORG-SEC-03',
    requestedScope: 'Sandbox-Ledger:Access, Micro-Grant:Audit',
    status: 'pending',
    requestDate: '2026-10-14T09:15:00Z',
    approvedDate: null,
    expiryDate: null,
    dpkiTokenId: 'TOK-FED-PENDING-01',
    verificationStatus: 'Awaiting Peer Review',
    assuranceLevel: 'LoA-2 (Identity Verified, Awaiting Org Trust)'
  },
  {
    id: 'did:dpki:cld:user:alex.ramirez',
    name: 'Alex Ramirez',
    email: 'a.ramirez@cloudbridge.io',
    title: 'Site Reliability Director',
    homeOrgId: 'ORG-CLD-04',
    targetOrgId: 'ORG-CYB-06',
    requestedScope: 'Threat-Stream:Bi-Directional',
    status: 'rejected',
    requestDate: '2026-10-02T16:00:00Z',
    approvedDate: null,
    expiryDate: null,
    dpkiTokenId: 'TOK-FED-REJECTED-02',
    verificationStatus: 'Rejected (Target Org Suspended)',
    assuranceLevel: 'N/A'
  }
];

export const INITIAL_CERTIFICATES = [
  {
    id: 'CERT-APEX-ROOT-001',
    subject: 'did:dpki:apex:root-authority',
    subjectCommonName: 'Apex University Sovereign DPKI Root',
    subjectType: 'Signing Authority',
    issuerOrgId: 'ORG-APEX-01',
    issuerName: 'Apex University',
    fingerprint: 'SHA256:88:AC:32:01:9B:4F:77:21:EE:55:10:9C:3A:D8:02:64:99:A2:4B:F7:01:83:29:CB:14:55:92:DF:31:AA:BB:CC',
    serialNumber: '4A79BF0299E18820',
    algorithm: 'Ed25519-DPKI',
    issuedDate: '2025-01-01T00:00:00Z',
    expiryDate: '2030-01-01T00:00:00Z',
    status: 'Valid', // 'Valid' | 'Expiring Soon' | 'Expired' | 'Revoked'
    keySize: '256-bit Curve25519',
    usage: 'Digital Signature, CRL Sign, Certificate Verification',
    revocationReason: null,
    pem: generateMockPEM('Apex University Sovereign DPKI Root', 'Apex University', '4A79BF0299E18820', 'SHA256:88:AC:...')
  },
  {
    id: 'CERT-APEX-USR-8849',
    subject: 'did:dpki:apex:user:elena.rostova',
    subjectCommonName: 'Dr. Elena Rostova [Principal Cryptographer]',
    subjectType: 'Identity / User',
    issuerOrgId: 'ORG-APEX-01',
    issuerName: 'Apex University',
    fingerprint: 'SHA256:39:B4:7E:29:10:D8:52:99:AA:34:F1:C0:88:91:EE:27:0B:44:81:92:3F:8A:2B:65:C7:99:00:44:1A:FE:22:98',
    serialNumber: '293847AF8820019C',
    algorithm: 'Ed25519-DPKI',
    issuedDate: '2026-01-15T08:00:00Z',
    expiryDate: '2027-01-15T08:00:00Z',
    status: 'Valid',
    keySize: '256-bit Curve25519',
    usage: 'Federated Authentication, Non-Repudiation, Key Agreement',
    revocationReason: null,
    pem: generateMockPEM('Dr. Elena Rostova', 'Apex University', '293847AF8820019C', 'SHA256:39:B4:...')
  },
  {
    id: 'CERT-NOVA-SRV-3310',
    subject: 'did:dpki:nova:svc:quantum-mesh-node',
    subjectCommonName: 'Nova Quantum Simulator Gateway Service',
    subjectType: 'Service Mesh TLS',
    issuerOrgId: 'ORG-NOVA-02',
    issuerName: 'Nova Research Labs',
    fingerprint: 'SHA256:9F:88:21:4A:BC:09:55:22:11:77:E4:39:AA:10:3B:58:62:80:CC:D1:49:19:98:AA:76:55:01:FE:22:38:11:82',
    serialNumber: '61E094AA39B0217F',
    algorithm: 'RSA-4096-PSS',
    issuedDate: '2025-10-25T12:00:00Z',
    expiryDate: '2026-10-25T12:00:00Z', // In 10 days! Expiring Soon
    status: 'Expiring Soon',
    keySize: '4096-bit RSA',
    usage: 'TLS Web Server Authentication, Mutual Identity Handshake',
    revocationReason: null,
    pem: generateMockPEM('Nova Quantum Gateway Service', 'Nova Research Labs', '61E094AA39B0217F', 'SHA256:9F:88:...')
  },
  {
    id: 'CERT-SEC-SETTLE-009',
    subject: 'did:dpki:sec:settlement:core-ledger-alpha',
    subjectCommonName: 'SecureBank Interbank Settlement Signer Alpha',
    subjectType: 'Signing Authority',
    issuerOrgId: 'ORG-SEC-03',
    issuerName: 'SecureBank Technologies',
    fingerprint: 'SHA256:4C:19:22:8A:EF:61:90:34:B7:AA:99:38:21:09:44:87:D5:11:22:FF:88:00:3B:A1:49:EE:12:87:90:3A:C1:22',
    serialNumber: '839211EE99814402',
    algorithm: 'ECDSA-P384',
    issuedDate: '2025-06-01T10:00:00Z',
    expiryDate: '2026-06-01T10:00:00Z',
    status: 'Revoked',
    keySize: '384-bit Prime256v1',
    usage: 'Digital Signature, Cross-Border Clearing',
    revocationReason: 'Key Compromise - Suspected HSM Nonce Leakage during audit',
    revocationDate: '2026-08-14T18:22:00Z',
    pem: generateMockPEM('SecureBank Settlement Signer Alpha', 'SecureBank Technologies', '839211EE99814402', 'SHA256:4C:19:...')
  },
  {
    id: 'CERT-CLD-EDGE-714',
    subject: 'did:dpki:cld:edge:us-east-router-04',
    subjectCommonName: 'CloudBridge ZeroTrust Edge Router #04',
    subjectType: 'Service Mesh TLS',
    issuerOrgId: 'ORG-CLD-04',
    issuerName: 'CloudBridge Systems',
    fingerprint: 'SHA256:11:99:AA:88:77:22:BB:33:CC:44:DD:55:EE:66:FF:00:12:34:56:78:9A:BC:DE:F0:11:22:33:44:55:66:77:88',
    serialNumber: '1092837465544321',
    algorithm: 'Ed25519-DPKI',
    issuedDate: '2024-04-10T09:00:00Z',
    expiryDate: '2025-04-10T09:00:00Z', // Expired
    status: 'Expired',
    keySize: '256-bit Curve25519',
    usage: 'Data Encipherment, Mesh TLS Node',
    revocationReason: null,
    pem: generateMockPEM('CloudBridge Edge Router #04', 'CloudBridge Systems', '1092837465544321', 'SHA256:11:99:...')
  },
  {
    id: 'CERT-GOV-ROOT-TRUST',
    subject: 'did:dpki:gov:sovereign:root-ca',
    subjectCommonName: 'Federal Digital Identity Trust Anchor CA',
    subjectType: 'Signing Authority',
    issuerOrgId: 'ORG-GOV-05',
    issuerName: 'Digital Government Services',
    fingerprint: 'SHA256:99:88:77:66:55:44:33:22:11:00:AA:BB:CC:DD:EE:FF:12:34:56:78:9A:BC:DE:F0:09:87:65:43:21:FE:DC:BA',
    serialNumber: '9988112233445566',
    algorithm: 'RSA-4096-PSS',
    issuedDate: '2023-11-01T00:00:00Z',
    expiryDate: '2033-11-01T00:00:00Z',
    status: 'Valid',
    keySize: '4096-bit RSA',
    usage: 'Certificate Signing, Policy Enforcement, Sovereign Anchor',
    revocationReason: null,
    pem: generateMockPEM('Federal Digital Identity Trust Anchor CA', 'Digital Government Services', '9988112233445566', 'SHA256:99:88:...')
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'LOG-884901',
    timestamp: '2026-10-15T08:10:12Z',
    eventType: 'CERT_VERIFIED',
    organization: 'Nova Research Labs',
    orgId: 'ORG-NOVA-02',
    targetId: 'CERT-APEX-USR-8849',
    description: 'Mutual TLS and DID federation verification of Dr. Elena Rostova passed cross-cluster handshake.',
    severity: 'Info', // 'Info' | 'Low' | 'Medium' | 'High' | 'Critical'
    result: 'Success', // 'Success' | 'Failure' | 'Blocked'
    node: 'node-03.nova.mesh.net'
  },
  {
    id: 'LOG-884902',
    timestamp: '2026-10-15T07:44:20Z',
    eventType: 'FEDERATION_REQUEST',
    organization: 'Apex University',
    orgId: 'ORG-APEX-01',
    targetId: 'did:dpki:apex:user:jonas.muller',
    description: 'Initiated cross-org federation claim request towards SecureBank Technologies for Sandbox-Ledger access.',
    severity: 'Low',
    result: 'Success',
    node: 'auth-gateway.apex.edu'
  },
  {
    id: 'LOG-884903',
    timestamp: '2026-10-15T05:20:00Z',
    eventType: 'KEY_ROTATION',
    organization: 'Digital Government Services',
    orgId: 'ORG-GOV-05',
    targetId: 'CERT-GOV-ROOT-TRUST',
    description: 'Automated decentralized consensus round completed; validator quorum confirmed active state of root anchor.',
    severity: 'Info',
    result: 'Success',
    node: 'consensus-01.digitalgov.gov'
  },
  {
    id: 'LOG-884904',
    timestamp: '2026-10-14T22:15:30Z',
    eventType: 'CERT_REVOKED',
    organization: 'SecureBank Technologies',
    orgId: 'ORG-SEC-03',
    targetId: 'CERT-SEC-SETTLE-009',
    description: 'Emergency revocation published to decentralized CRL ledger. Reason: Key Compromise - Suspected HSM Nonce Leakage.',
    severity: 'Critical',
    result: 'Success',
    node: 'hsm-cluster.securebank.tech'
  },
  {
    id: 'LOG-884905',
    timestamp: '2026-10-14T19:05:11Z',
    eventType: 'TRUST_SUSPENDED',
    organization: 'CloudBridge Systems',
    orgId: 'ORG-CLD-04',
    targetId: 'ORG-CYB-06',
    description: 'Trust edge to CyberShield Defense Systems marked suspended due to unresponsiveness in cryptographic heartbeat.',
    severity: 'High',
    result: 'Blocked',
    node: 'edge-sentry.cloudbridge.io'
  },
  {
    id: 'LOG-884906',
    timestamp: '2026-10-14T14:30:45Z',
    eventType: 'CERT_ISSUED',
    organization: 'Apex University',
    orgId: 'ORG-APEX-01',
    targetId: 'CERT-APEX-USR-8849',
    description: 'Issued high-assurance post-graduate research credential with Ed25519-DPKI signature format.',
    severity: 'Medium',
    result: 'Success',
    node: 'ca-authority.apex.edu'
  },
  {
    id: 'LOG-884907',
    timestamp: '2026-10-14T11:00:18Z',
    eventType: 'FEDERATION_APPROVED',
    organization: 'Nova Research Labs',
    orgId: 'ORG-NOVA-02',
    targetId: 'did:dpki:apex:user:elena.rostova',
    description: 'Approved cross-institution quantum computation simulation claims following cryptographic fingerprint match.',
    severity: 'Info',
    result: 'Success',
    node: 'policy-enforcer.novalabs.org'
  }
];

export const CURRENT_USER_DEFAULT = {
  id: 'USR-SEC-CSO-01',
  name: 'Dr. Elena Rostova',
  role: 'Chief Security Officer & Identity Architect',
  email: 'e.rostova@apex.edu',
  organizationId: 'ORG-APEX-01',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop',
  clearanceLevel: 'Top Secret / DPKI Sovereign',
  keysManaged: 14
};
