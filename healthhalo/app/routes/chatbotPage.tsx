import React, { useState } from 'react';
import Sidebar from './components/sidebar'; // Your beautiful sidebar
import ChatbotLayout from './components/chatbotLayout'; // The content block we just made
import { Bell, Search, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';

import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => [
  { title: "Chatbot | HealthHalo" },
  { name: "description", content: "Healthhalo's chatbot!" },
];

const ChatbotPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 flex-shrink-0">
        <Sidebar
          currentPath={location.pathname}
          isCollapsed={false}
          onToggleCollapse={() => {}}
        />
      </div>

      {/* Mobile Sidebar (Drawer) */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="w-72 h-full">
          <Sidebar
            currentPath={location.pathname}
            isCollapsed={false}
            onToggleCollapse={() => {}}
            onLinkClick={() => setIsSidebarOpen(false)}
          />
        </div>
        <div className="fixed inset-0 bg-black/30" onClick={() => setIsSidebarOpen(false)}></div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Bar - No header for a more immersive chat experience */}
        {/* We can hide the standard header to make the chat take up more space */}
        
        {/* The main content area now has different padding and directly holds the layout */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {/* We use a max-height here to contain the chat layout within the viewport */}
          <div className="w-full h-full">
            <ChatbotLayout />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatbotPage;