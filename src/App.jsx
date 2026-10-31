import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import ServiceDirectoryPage from './pages/ServiceDirectoryPage';
import AIAssistantPage from './pages/AIAssistantPage';
import GrievancePage from './pages/GrievancePage';
import MyGrievancesPage from './pages/MyGrievancesPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';

// Layout wrapper — pages that need Navbar + Footer
function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Routes>
        {/* Auth page — full screen, no shared layout */}
        <Route path="/login" element={<LoginPage />} />

        {/* Main pages — with Navbar + Footer */}
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/services" element={<Layout><ServiceDirectoryPage /></Layout>} />
        <Route path="/ai-assistant" element={<Layout><AIAssistantPage /></Layout>} />
        <Route path="/grievance/new" element={<Layout><GrievancePage /></Layout>} />
        <Route path="/my-grievances" element={<Layout><MyGrievancesPage /></Layout>} />
        <Route path="/admin" element={<Layout><AdminDashboardPage /></Layout>} />

        {/* Catch-all */}
        <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
      </Routes>
    </AppProvider>
  );
}
