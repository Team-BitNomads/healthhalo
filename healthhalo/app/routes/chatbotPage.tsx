import React, { useState } from 'react';
import Sidebar from './components/sidebar';
import ChatbotLayout from './components/chatbotLayout';
import { useLocation } from 'react-router-dom';
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => [
  { title: "AI Assistant | HealthHalo" },
  { name: "description", content: "Chat with the HealthHalo AI Assistant!" },
];

const ChatbotPage = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-slate-100">
      <div className={`relative hidden lg:block flex-shrink-0 transition-all duration-300 ease-in-out ${
        isDesktopSidebarCollapsed ? 'w-24' : 'w-72'
      }`}>
        <Sidebar
          currentPath={location.pathname}
          isCollapsed={isDesktopSidebarCollapsed}
          onToggleCollapse={() => setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed)}
        />
      </div>

      <div className={`fixed inset-0 z-40 lg:hidden transition-transform duration-300 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="w-72 h-full">
          <Sidebar
            currentPath={location.pathname}
            isCollapsed={false}
            onToggleCollapse={() => {}}
            onLinkClick={() => setIsMobileSidebarOpen(false)}
          />
        </div>
        <div className="fixed inset-0 bg-black/30" onClick={() => setIsMobileSidebarOpen(false)}></div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="w-full h-full">
            <ChatbotLayout />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatbotPage;