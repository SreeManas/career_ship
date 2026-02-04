import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Botpress Chatbot Widget (v3.5)
 * Only renders for authenticated users
 */
const ChatBot = () => {
    const { user } = useAuth();

    useEffect(() => {
        // Only load chatbot if user is logged in
        if (!user) return;

        // Check if script already exists
        if (document.getElementById('botpress-webchat')) return;

        // Create iframe for Botpress v3.5 webchat
        const container = document.createElement('div');
        container.id = 'botpress-webchat';
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
        `;

        // Create toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'bp-toggle-btn';
        toggleBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
        `;
        toggleBtn.style.cssText = `
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
            transition: transform 0.2s, box-shadow 0.2s;
        `;
        toggleBtn.onmouseover = () => {
            toggleBtn.style.transform = 'scale(1.1)';
            toggleBtn.style.boxShadow = '0 6px 25px rgba(99, 102, 241, 0.5)';
        };
        toggleBtn.onmouseout = () => {
            toggleBtn.style.transform = 'scale(1)';
            toggleBtn.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.4)';
        };

        // Create iframe container
        const iframeContainer = document.createElement('div');
        iframeContainer.id = 'bp-iframe-container';
        iframeContainer.style.cssText = `
            display: none;
            position: absolute;
            bottom: 70px;
            right: 0;
            width: 400px;
            height: 600px;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        `;

        // Create iframe
        const iframe = document.createElement('iframe');
        iframe.src = 'https://cdn.botpress.cloud/webchat/v3.5/shareable.html?configUrl=https://files.bpcontent.cloud/2024/12/19/15/20241219150617-D1F9A1XZ.json';
        iframe.style.cssText = `
            width: 100%;
            height: 100%;
            border: none;
        `;
        iframe.allow = 'microphone';

        iframeContainer.appendChild(iframe);
        container.appendChild(iframeContainer);
        container.appendChild(toggleBtn);

        // Toggle chat visibility
        let isOpen = false;
        toggleBtn.onclick = () => {
            isOpen = !isOpen;
            iframeContainer.style.display = isOpen ? 'block' : 'none';
            toggleBtn.innerHTML = isOpen ? `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            ` : `
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            `;
        };

        document.body.appendChild(container);

        // Cleanup on unmount
        return () => {
            const widget = document.getElementById('botpress-webchat');
            if (widget) widget.remove();
        };
    }, [user]);

    return null;
};

export default ChatBot;
