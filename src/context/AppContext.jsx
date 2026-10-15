import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_ORGANIZATIONS,
  INITIAL_TRUST_RELATIONSHIPS,
  INITIAL_FEDERATED_IDENTITIES,
  INITIAL_CERTIFICATES,
  INITIAL_AUDIT_LOGS,
  CURRENT_USER_DEFAULT
} from '../data/mockData';
import { generateFingerprint, generateSerialNumber, generateMockPEM } from '../utils/cryptoUtils';

const AppContext = createContext();

const STORAGE_KEY_PREFIX = 'nexdpki_state_v1_';

export const AppProvider = ({ children }) => {
  // Organizations
  const [organizations, setOrganizations] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}orgs`);
    return saved ? JSON.parse(saved) : INITIAL_ORGANIZATIONS;
  });

  // Trust Relationships
  const [trustRelationships, setTrustRelationships] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}trust_rels`);
    return saved ? JSON.parse(saved) : INITIAL_TRUST_RELATIONSHIPS;
  });

  // Federated Identities
  const [federatedIdentities, setFederatedIdentities] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}federations`);
    return saved ? JSON.parse(saved) : INITIAL_FEDERATED_IDENTITIES;
  });

  // PKI Certificates
  const [certificates, setCertificates] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}certs`);
    return saved ? JSON.parse(saved) : INITIAL_CERTIFICATES;
  });

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}logs`);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Current User / Auth State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}user`);
    return saved ? JSON.parse(saved) : CURRENT_USER_DEFAULT;
  });

  // Active Organization context
  const [activeOrgId, setActiveOrgId] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}active_org`);
    return saved || 'ORG-APEX-01';
  });

  // Toast Notifications
  const [toasts, setToasts] = useState([]);

  // Live SOC Stream state for simulation
  const [liveStreamActive, setLiveStreamActive] = useState(false);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}orgs`, JSON.stringify(organizations));
  }, [organizations]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}trust_rels`, JSON.stringify(trustRelationships));
  }, [trustRelationships]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}federations`, JSON.stringify(federatedIdentities));
  }, [federatedIdentities]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}certs`, JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}logs`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}user`, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}active_org`, activeOrgId);
  }, [activeOrgId]);

  // Toast Helper
  const addToast = (title, message, type = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    const newToast = { id, title, message, type };
    setToasts((prev) => [newToast, ...prev].slice(0, 5));

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Add Security Audit Log helper
  const addAuditLog = ({ eventType, organization, orgId, targetId, description, severity = 'Info', result = 'Success' }) => {
    const newLog = {
      id: `LOG-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      eventType,
      organization: organization || 'Consensus Network',
      orgId: orgId || activeOrgId,
      targetId: targetId || 'N/A',
      description,
      severity,
      result,
      node: `peer-${Math.floor(Math.random() * 9 + 1)}.dpki-mesh.net`
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Switch Active Organization
  const switchActiveOrg = (orgId) => {
    const org = organizations.find((o) => o.id === orgId);
    if (!org) return;
    setActiveOrgId(orgId);
    setCurrentUser((prev) => ({
      ...prev,
      organizationId: org.id,
      email: `admin@${org.domain}`
    }));
    addToast('Context Switched', `Active organization changed to ${org.name}`, 'info');
  };

  // Register New Organization
  const registerOrganization = (orgData) => {
    const id = `ORG-${orgData.shortName.toUpperCase().replace(/\s+/g, '').slice(0, 4)}-${Math.floor(10 + Math.random() * 89)}`;
    const fingerprint = generateFingerprint();
    const newOrg = {
      id,
      name: orgData.name,
      shortName: orgData.shortName,
      domain: orgData.domain,
      type: orgData.type || 'Consortium Participant',
      fingerprint,
      trustScore: 85,
      trustStatus: 'active',
      registrationDate: new Date().toISOString(),
      nodesCount: orgData.nodesCount ? parseInt(orgData.nodesCount, 10) : 4,
      contactEmail: orgData.contactEmail || `sec@${orgData.domain}`,
      consensusWeight: '12%',
      algorithm: orgData.algorithm || 'Ed25519-DPKI',
      location: orgData.location || 'Distributed Node',
      description: orgData.description || 'Verified cross-organization identity federation anchor.'
    };

    setOrganizations((prev) => [newOrg, ...prev]);

    // Automatically create a reciprocal active trust relationship with current active organization
    const newRel = {
      id: `REL-${Date.now().toString().slice(-4)}`,
      sourceOrgId: activeOrgId,
      targetOrgId: id,
      status: 'active',
      trustScore: 88,
      protocol: 'Decentralized-PKI-v2.4',
      establishedDate: new Date().toISOString(),
      mutualVerification: true,
      policyScope: 'Consortium Identity Federation'
    };
    setTrustRelationships((prev) => [newRel, ...prev]);

    addAuditLog({
      eventType: 'ORG_REGISTERED',
      organization: newOrg.name,
      orgId: newOrg.id,
      targetId: newOrg.id,
      description: `New organization registered into decentralized trust fabric with root key fingerprint ${fingerprint.slice(0, 20)}...`,
      severity: 'Medium',
      result: 'Success'
    });

    addToast('Organization Registered', `${newOrg.name} has joined the decentralized PKI network.`, 'success');
    return newOrg;
  };

  // Update Organization Trust Status
  const updateOrganizationTrust = (orgId, newStatus) => {
    const org = organizations.find((o) => o.id === orgId);
    if (!org) return;

    setOrganizations((prev) =>
      prev.map((o) => (o.id === orgId ? { ...o, trustStatus: newStatus } : o))
    );

    // Update related trust relationships
    setTrustRelationships((prev) =>
      prev.map((r) => {
        if (r.sourceOrgId === orgId || r.targetOrgId === orgId) {
          return { ...r, status: newStatus };
        }
        return r;
      })
    );

    addAuditLog({
      eventType: newStatus === 'active' ? 'TRUST_ESTABLISHED' : 'TRUST_SUSPENDED',
      organization: org.name,
      orgId: org.id,
      targetId: org.id,
      description: `Organization trust status updated to '${newStatus.toUpperCase()}' by authorized security authority.`,
      severity: newStatus === 'active' ? 'Info' : 'High',
      result: 'Success'
    });

    addToast('Trust Status Updated', `${org.name} status is now ${newStatus.toUpperCase()}`, 'info');
  };

  // Issue New Certificate
  const issueCertificate = (certData) => {
    const issuerOrg = organizations.find((o) => o.id === certData.issuerOrgId) || organizations[0];
    const serial = generateSerialNumber();
    const fingerprint = generateFingerprint();
    const certId = `CERT-${issuerOrg.shortName.toUpperCase().replace(/\s+/g, '')}-${Date.now().toString().slice(-4)}`;

    const newCert = {
      id: certId,
      subject: certData.subject,
      subjectCommonName: certData.subjectCommonName || certData.subject,
      subjectType: certData.subjectType || 'Identity / User',
      issuerOrgId: issuerOrg.id,
      issuerName: issuerOrg.name,
      fingerprint,
      serialNumber: serial,
      algorithm: certData.algorithm || 'Ed25519-DPKI',
      issuedDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + (certData.validityDays || 365) * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Valid',
      keySize: certData.algorithm?.includes('RSA') ? '4096-bit RSA' : '256-bit Curve25519',
      usage: certData.usage || 'Federated Authentication, Digital Signature, Key Agreement',
      revocationReason: null,
      pem: generateMockPEM(certData.subjectCommonName || certData.subject, issuerOrg.name, serial, fingerprint)
    };

    setCertificates((prev) => [newCert, ...prev]);

    addAuditLog({
      eventType: 'CERT_ISSUED',
      organization: issuerOrg.name,
      orgId: issuerOrg.id,
      targetId: newCert.id,
      description: `Cryptographic digital certificate issued for subject '${newCert.subjectCommonName}' using ${newCert.algorithm}.`,
      severity: 'Medium',
      result: 'Success'
    });

    addToast('Certificate Issued', `Certificate ${newCert.id} created and published to decentralized ledger.`, 'success');
    return newCert;
  };

  // Revoke Certificate
  const revokeCertificate = (certId, reason) => {
    const cert = certificates.find((c) => c.id === certId);
    if (!cert) return;

    const revocationDate = new Date().toISOString();
    setCertificates((prev) =>
      prev.map((c) =>
        c.id === certId
          ? {
              ...c,
              status: 'Revoked',
              revocationReason: reason || 'Key Compromise or Administrative Revocation',
              revocationDate
            }
          : c
      )
    );

    addAuditLog({
      eventType: 'CERT_REVOKED',
      organization: cert.issuerName,
      orgId: cert.issuerOrgId,
      targetId: cert.id,
      description: `Certificate ${cert.id} REVOKED. Reason: ${reason || 'Administrative Revocation'}. Broadcast to decentralized CRL/OCSP nodes.`,
      severity: 'Critical',
      result: 'Success'
    });

    addToast('Certificate Revoked', `Certificate ${cert.id} revoked and added to CRL ledger.`, 'error');
  };

  // Register New Federated Identity Request
  const createFederationRequest = (requestData) => {
    const homeOrg = organizations.find((o) => o.id === requestData.homeOrgId) || organizations[0];
    const targetOrg = organizations.find((o) => o.id === requestData.targetOrgId) || organizations[1];

    const slug = requestData.name.toLowerCase().replace(/[^a-z0-9]/g, '.');
    const newId = `did:dpki:${homeOrg.shortName.toLowerCase().slice(0, 4)}:user:${slug}`;
    const tokenId = `TOK-FED-${Math.floor(10000 + Math.random() * 89999)}-${homeOrg.shortName.slice(0, 1)}`;

    const newFederation = {
      id: newId,
      name: requestData.name,
      email: requestData.email,
      title: requestData.title || 'Federated Member',
      homeOrgId: homeOrg.id,
      targetOrgId: targetOrg.id,
      requestedScope: requestData.requestedScope || 'Default-Access:Read',
      status: 'pending',
      requestDate: new Date().toISOString(),
      approvedDate: null,
      expiryDate: null,
      dpkiTokenId: tokenId,
      verificationStatus: 'Pending Peer Org Authorization',
      assuranceLevel: 'LoA-3 (Hardware Credential)'
    };

    setFederatedIdentities((prev) => [newFederation, ...prev]);

    addAuditLog({
      eventType: 'FEDERATION_REQUEST',
      organization: homeOrg.name,
      orgId: homeOrg.id,
      targetId: newFederation.id,
      description: `Cross-organization identity federation request initiated by ${homeOrg.name} targeting ${targetOrg.name}.`,
      severity: 'Low',
      result: 'Success'
    });

    addToast('Federation Requested', `Identity claim request submitted to ${targetOrg.name}.`, 'info');
    return newFederation;
  };

  // Update Federated Identity Status
  const updateFederationStatus = (identityId, newStatus) => {
    const item = federatedIdentities.find((f) => f.id === identityId);
    if (!item) return;

    const targetOrg = organizations.find((o) => o.id === item.targetOrgId);
    const approvedDate = newStatus === 'approved' ? new Date().toISOString() : null;
    const expiryDate = newStatus === 'approved' ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() : null;

    setFederatedIdentities((prev) =>
      prev.map((f) =>
        f.id === identityId
          ? {
              ...f,
              status: newStatus,
              approvedDate,
              expiryDate,
              verificationStatus:
                newStatus === 'approved'
                  ? 'Verified (Mutual Cross-Org Cryptographic Proof)'
                  : 'Rejected by Target Policy Enforcer'
            }
          : f
      )
    );

    addAuditLog({
      eventType: newStatus === 'approved' ? 'FEDERATION_APPROVED' : 'FEDERATION_REJECTED',
      organization: targetOrg?.name || 'Target Org',
      orgId: targetOrg?.id || item.targetOrgId,
      targetId: item.id,
      description: `Federation request for '${item.name}' was ${newStatus.toUpperCase()} by ${targetOrg?.name || 'Relying Authority'}.`,
      severity: newStatus === 'approved' ? 'Info' : 'Medium',
      result: newStatus === 'approved' ? 'Success' : 'Blocked'
    });

    addToast(
      `Federation ${newStatus === 'approved' ? 'Approved' : 'Rejected'}`,
      `Request for ${item.name} has been marked ${newStatus}.`,
      newStatus === 'approved' ? 'success' : 'warning'
    );
  };

  // Certificate Verification Engine (Simulates multi-step cryptographic verification)
  const verifyCertificateDetails = async (certIdOrFingerprint) => {
    // Look up certificate in state
    const cleanQuery = certIdOrFingerprint.trim().toLowerCase();
    const cert = certificates.find(
      (c) =>
        c.id.toLowerCase() === cleanQuery ||
        c.fingerprint.toLowerCase().includes(cleanQuery) ||
        c.subject.toLowerCase().includes(cleanQuery)
    );

    // Check issuer organization
    const issuer = cert ? organizations.find((o) => o.id === cert.issuerOrgId) : null;
    // Check if issuer has active trust relationship with activeOrgId
    const trustRel = issuer
      ? trustRelationships.find(
          (r) =>
            (r.sourceOrgId === activeOrgId && r.targetOrgId === issuer.id) ||
            (r.sourceOrgId === issuer.id && r.targetOrgId === activeOrgId) ||
            r.sourceOrgId === r.targetOrgId
        )
      : null;

    const isIssuerRecognized = !!issuer;
    const isIssuerActive = issuer?.trustStatus === 'active';
    const isTrustRelActive = activeOrgId === issuer?.id ? true : trustRel?.status === 'active';
    const isNotRevoked = cert?.status !== 'Revoked';
    const isNotExpired = cert ? new Date(cert.expiryDate) > new Date() : false;
    const isExpiringSoon = cert?.status === 'Expiring Soon';

    const overallValid =
      !!cert && isIssuerRecognized && isIssuerActive && isTrustRelActive && isNotRevoked && isNotExpired;

    const resultReport = {
      timestamp: new Date().toISOString(),
      searchedQuery: certIdOrFingerprint,
      found: !!cert,
      certificate: cert || null,
      issuer: issuer || null,
      trustRelationship: trustRel || null,
      checks: {
        issuerRecognized: {
          passed: isIssuerRecognized,
          label: 'Issuer Identity & DID Document Resolution',
          detail: isIssuerRecognized
            ? `Recognized valid consortium issuer: ${issuer.name} (${issuer.id})`
            : 'Issuer identity document could not be resolved from decentralized ledger.'
        },
        trustRelationship: {
          passed: isTrustRelActive,
          label: 'Cross-Organization Trust Fabric Link',
          detail: isTrustRelActive
            ? `Active bilateral cryptographic trust bridge established (Score: ${trustRel?.trustScore || 100}/100)`
            : 'Bilateral trust link is suspended, pending, or severed.'
        },
        revocationStatus: {
          passed: isNotRevoked,
          label: 'Decentralized CRL & OCSP Consensus Check',
          detail: isNotRevoked
            ? 'Certificate is clean. Zero revocation proofs recorded in consensus ledger.'
            : `REVOCATION DETECTED: ${cert.revocationReason || 'Key Compromised'}`
        },
        expiryStatus: {
          passed: isNotExpired,
          isWarning: isExpiringSoon,
          label: 'Cryptographic Validity Period & Time-Lock',
          detail: isNotExpired
            ? isExpiringSoon
              ? `WARNING: Expiring within 10 days (${new Date(cert.expiryDate).toLocaleDateString()})`
              : `Valid through ${new Date(cert.expiryDate).toLocaleDateString()}`
            : 'Certificate has EXPIRED. Cryptographic signatures are no longer valid.'
        },
        federationEligibility: {
          passed: overallValid,
          label: 'Identity Federation & Cross-Domain Authorization',
          detail: overallValid
            ? 'Eligible for seamless cross-organization DPKI token delegation.'
            : 'Ineligible for cross-organization identity federation handshakes.'
        }
      },
      verdict: overallValid ? (isExpiringSoon ? 'WARNING' : 'VALID') : 'INVALID'
    };

    // Log the verification
    addAuditLog({
      eventType: 'CERT_VERIFIED',
      organization: issuer?.name || 'External Verifier',
      orgId: issuer?.id || activeOrgId,
      targetId: cert?.id || certIdOrFingerprint,
      description: `Cryptographic verification executed for ${cert?.id || certIdOrFingerprint}. Verdict: ${resultReport.verdict}.`,
      severity: resultReport.verdict === 'VALID' ? 'Info' : resultReport.verdict === 'WARNING' ? 'Medium' : 'High',
      result: resultReport.verdict === 'INVALID' ? 'Failure' : 'Success'
    });

    return resultReport;
  };

  // Reset All Demo Data to initial defaults
  const resetAllData = () => {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}orgs`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}trust_rels`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}federations`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}certs`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}logs`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}user`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}active_org`);

    setOrganizations(INITIAL_ORGANIZATIONS);
    setTrustRelationships(INITIAL_TRUST_RELATIONSHIPS);
    setFederatedIdentities(INITIAL_FEDERATED_IDENTITIES);
    setCertificates(INITIAL_CERTIFICATES);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setCurrentUser(CURRENT_USER_DEFAULT);
    setActiveOrgId('ORG-APEX-01');

    addToast('Demo State Reset', 'System has been restored to factory test data.', 'info');
  };

  // Periodically generate simulated live audit events if stream is toggled on
  useEffect(() => {
    if (!liveStreamActive) return;

    const interval = setInterval(() => {
      const simulatedEvents = [
        {
          eventType: 'CERT_VERIFIED',
          organization: 'Apex University',
          orgId: 'ORG-APEX-01',
          targetId: 'CERT-APEX-USR-8849',
          description: 'Automated TLS-DPoP token re-verification succeeded via peer node #04.',
          severity: 'Info',
          result: 'Success'
        },
        {
          eventType: 'CONSENSUS_SYNC',
          organization: 'Digital Government Services',
          orgId: 'ORG-GOV-05',
          targetId: 'LEDGER-BLOCK-8841',
          description: 'Decentralized PKI validator block #1,849,205 committed with 100% quorum.',
          severity: 'Info',
          result: 'Success'
        },
        {
          eventType: 'FEDERATION_HEARTBEAT',
          organization: 'Nova Research Labs',
          orgId: 'ORG-NOVA-02',
          targetId: 'MESH-LINK-NOVA-CLD',
          description: 'Cross-organization key agreement heartbeat verified with 14ms latency.',
          severity: 'Low',
          result: 'Success'
        }
      ];

      const chosen = simulatedEvents[Math.floor(Math.random() * simulatedEvents.length)];
      addAuditLog(chosen);
    }, 8000);

    return () => clearInterval(interval);
  }, [liveStreamActive]);

  const activeOrg = organizations.find((o) => o.id === activeOrgId) || organizations[0];

  return (
    <AppContext.Provider
      value={{
        organizations,
        trustRelationships,
        federatedIdentities,
        certificates,
        auditLogs,
        currentUser,
        setCurrentUser,
        activeOrgId,
        activeOrg,
        switchActiveOrg,
        registerOrganization,
        updateOrganizationTrust,
        issueCertificate,
        revokeCertificate,
        createFederationRequest,
        updateFederationStatus,
        verifyCertificateDetails,
        addAuditLog,
        resetAllData,
        toasts,
        addToast,
        removeToast,
        liveStreamActive,
        setLiveStreamActive
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
