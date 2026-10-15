import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Sidebar } from './components/common/Sidebar';
import { Navbar } from './components/common/Navbar';
import { ToastContainer } from './components/common/ToastContainer';

// Pages
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { OrganizationsPage } from './pages/OrganizationsPage';
import { FederationPage } from './pages/FederationPage';
import { CertificatesPage } from './pages/CertificatesPage';
import { TrustNetworkPage } from './pages/TrustNetworkPage';
import { VerifyPage } from './pages/VerifyPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { SettingsPage } from './pages/SettingsPage';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col antialiased">
      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Responsive Cyber Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area (offset by sidebar on desktop) */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        {/* Top Navigation */}
        <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />

        {/* Dynamic Page Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Subtle Enterprise Footer */}
        <footer className="py-4 px-6 border-t border-slate-900 text-center text-xs text-slate-500 font-mono">
          <span>NexDPKI Management Framework v2.4 • Decentralized Cross-Organization Identity Federation</span>
        </footer>
      </div>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Login Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Authenticated Dashboard Pages wrapped in Layout */}
          <Route
            path="/"
            element={
              <Layout>
                <DashboardPage />
              </Layout>
            }
          />
          <Route
            path="/organizations"
            element={
              <Layout>
                <OrganizationsPage />
              </Layout>
            }
          />
          <Route
            path="/federation"
            element={
              <Layout>
                <FederationPage />
              </Layout>
            }
          />
          <Route
            path="/certificates"
            element={
              <Layout>
                <CertificatesPage />
              </Layout>
            }
          />
          <Route
            path="/trust-network"
            element={
              <Layout>
                <TrustNetworkPage />
              </Layout>
            }
          />
          <Route
            path="/verify"
            element={
              <Layout>
                <VerifyPage />
              </Layout>
            }
          />
          <Route
            path="/audit-logs"
            element={
              <Layout>
                <AuditLogsPage />
              </Layout>
            }
          />
          <Route
            path="/settings"
            element={
              <Layout>
                <SettingsPage />
              </Layout>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
