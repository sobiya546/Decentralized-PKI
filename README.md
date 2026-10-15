# NexDPKI — Decentralized Public Key Infrastructure Management Framework

> **A Secure Cross-Organization Identity Federation & Trust Fabric Web Platform**

NexDPKI is an enterprise-grade cybersecurity frontend application demonstrating how distributed organizations register, exchange trusted identities, verify digital certificates, evaluate multi-party trust chains, and detect revoked or compromised cryptographic keys using a decentralized PKI framework.

---

## 🌟 Key Capabilities & Features

### 1. 🛡️ Main Security Dashboard (`/`)
- **Key Metrics Overview**: Real-time summary counts for Total Registered Organizations, Active Federated Identities, Valid Digital Certificates, Expiring Soon Certificates, and Revoked Keys.
- **Decentralized Trust Mesh Widget**: Miniature interactive topology diagram showing consensus nodes and connecting trust links.
- **Certificate Status Breakdown**: Recharts-powered donut chart displaying status distributions (`Valid`, `Expiring Soon`, `Expired`, `Revoked`).
- **Telemetry Volume Graph**: 7-day cross-organization verification requests and federation activity area charts.
- **Live Security Audit Feed**: Real-time audit log stream displaying high and critical security events.
- **Pending Federation Handshakes**: Direct 1-click approvals for incoming cross-domain delegation requests.

### 2. 🏛️ Organization Management (`/organizations`)
- Manage 6 realistic consortium anchors:
  - **Apex University** (`ORG-APEX-01`): Academic & Research Trust Anchor
  - **Nova Research Labs** (`ORG-NOVA-02`): Quantum & AI Security Institute
  - **SecureBank Technologies** (`ORG-SEC-03`): Fintech Clearing Consortium
  - **CloudBridge Systems** (`ORG-CLD-04`): Zero-Trust Cloud & Mesh Infrastructure
  - **Digital Government Services** (`ORG-GOV-05`): Sovereign Public Sector Authority
  - **CyberShield Defense Systems** (`ORG-CYB-06`): Defense Threat Intelligence Anchor
- **Search & Filter**: Search by name, domain, ID, or public key fingerprint; filter by trust status (`Active`, `Pending`, `Suspended`).
- **Register Organization Modal**: Provision new organizations with automatic SHA-256 fingerprint and Ed25519 root key generation.
- **Organization Details Modal**: Inspect validator nodes, algorithm, jurisdiction, and connected trust links.
- **Simulated Trust Lifecycle**: Approve, suspend, or restore trust status with immediate ripple effects across the entire app.
- **CSV & JSON Export**: Download complete directory data.

### 3. 🌐 Identity Federation Management (`/federation`)
- **Clear IdP vs RP Distinction**: Explicitly visualizes Home Organization (Identity Provider) and Target Relying Party (Service Provider) with directional flow badges.
- **New Federation Request Form**: Submit cross-organization identity delegation claims with customized roles and scopes.
- **Verifiable Credential Proof Viewer**: Inspect simulated W3C JSON-LD Verifiable Credentials with cryptographic proof signatures (`Ed25519Signature2020`).
- **Approval Workflows**: Approve, reject, or revoke active federation tokens.
- **Exporting**: Download credentials and identity lists in CSV/JSON format.

### 4. 📜 PKI Digital Certificate Management (`/certificates`)
- **Comprehensive Lifecycle**: Filter by `Valid`, `Expiring Soon`, `Expired`, or `Revoked`.
- **Simulated Certificate Issuance**: Issue simulated certificates with customizable key algorithms (`Ed25519-DPKI`, `RSA-4096-PSS`, `ECDSA-P384`) and validity periods.
- **X.509 Certificate Inspector**: Inspect mock serial numbers, public key algorithms, subject alternative names, key usages, and PEM blocks with 1-click copy.
- **Simulated Revocation**: Revoke certificates with specific RFC 5280 reasons (*Key Compromise*, *Affiliation Changed*, *Superseded*, *Cessation of Operation*) and broadcast to the CRL.
- **Metadata Export**: Export individual or collective certificate registries to JSON/CSV.

### 5. 🕸️ Decentralized Trust Network Visualizer (`/trust-network`)
- **Interactive SVG Topology Graph**:
  - Interactive, draggable organization nodes.
  - Distinct edge styles: Cyan/Emerald (Active), Amber Dashed (Pending), Rose Dotted (Suspended).
  - Central BFT consensus core indicator.
  - Zoom in, Zoom out, pan, and reset canvas controls.
- **Trust Path Analysis Engine**: Select any Source and Target organization to calculate direct and multi-hop transitive trust chains and composite trust scores.
- **Organization Node Inspector**: Click any node to open the side drawer displaying inbound/outbound trust links, public key, and quick status actions.

### 6. 🔍 Certificate Verification Center (`/verify`)
- **Interactive Cryptographic Scanner**: Input Certificate ID or Subject DID, or click one of 4 quick presets:
  - *Preset 1: Valid Researcher Certificate* (100% Pass)
  - *Preset 2: Expiring Soon TLS Service Node* (Pass with Warning)
  - *Preset 3: Revoked Key Compromise* (Immediate Fail)
  - *Preset 4: Expired Certificate* (Immediate Fail)
- **5-Step Verification Hierarchy**:
  1. Issuer Identity & DID Document Resolution
  2. Cross-Organization Trust Fabric Link Check
  3. Decentralized CRL & OCSP Revocation Consensus Check
  4. Cryptographic Validity Period & Time-Lock Check
  5. Identity Federation & Delegation Eligibility
- **Audit Receipt Export**: Download a comprehensive cryptographic verification receipt in JSON format.

### 7. 📋 Security & Cryptographic Audit Logs (`/audit-logs`)
- Real-time immutable audit trail tracking all certificate issuances, revocations, verification checks, and trust status changes.
- Multi-filtering by Event Type and Severity (`Critical`, `High`, `Medium`, `Low`, `Info`).
- **Live SOC Stream Mode**: Periodic simulated consensus block commits and telemetry heartbeats.
- Click any log row to inspect the full JSON event payload.
- Export audit trail to CSV or JSON.

### 8. ⚙️ Settings & Configuration (`/settings`)
- User Security Profile & Clearance management.
- Active Organization Node Switcher (switches operating identity context between consortium members).
- Cryptographic algorithm and consensus protocol selection (`BFT-Mesh`, `Proof-of-Authority`, `Sovereign Raft`).
- CRL synchronization interval controls.
- API connection status placeholder (mock telemetry, latency metrics, and block height).
- 1-Click "Reset Demo Data" to restore factory defaults anytime.
- "Export Full State Backup" for saving the entire state tree.

### 9. 🔐 Authentication & Demo Logins (`/login`)
- Enterprise cybersecurity login portal with organization selector and show/hide password toggle.
- 1-Click Demo Profiles for instant login as:
  - *Apex University CSO (Dr. Elena Rostova)*
  - *Nova Research Labs Lead Architect (Marcus Vance)*
  - *Digital Government Services Federal Root Inspector*

---

## 💻 Tech Stack

- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 + Vanilla CSS cyber tokens
- **Routing**: React Router DOM v7
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **State & Persistence**: React Context API + LocalStorage synchronization
- **Architecture**: Modular separation into `components/`, `context/`, `data/`, `pages/`, and `utils/`

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18+ (tested on v24.x)
- **npm**: v9+ (tested on v11.x)

### 2. Installation
```bash
# Clone or navigate to the project directory
cd multimodel

# Install dependencies (already completed)
npm install
```

### 3. Running Locally
```bash
# Start Vite development server
npm run dev
```
Open your browser and navigate to:
```
http://localhost:5173/
```

### 4. Building for Production
```bash
# Compile and bundle for production
npm run build

# Preview production build locally
npm run preview
```

---

## 🔒 Security & Prototype Notice

This frontend application is an **interactive prototype and concept demonstrator**. All cryptographic operations (key pair generation, X.509 certificates, DID resolutions, and BFT consensus verification) are simulated in-browser with realistic identifiers, SHA-256 fingerprints, and mock PEM structures. No real private keys or sensitive credentials are used or stored.
