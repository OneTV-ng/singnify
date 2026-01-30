'use client';
// @/app/context/ShowMessageContext.tsx

import {ShowMessageType, ShowMessageContextType} from '@/app/lib/types';

import React, { createContext, useContext, useCallback } from 'react';

// Enhanced context type to include confirmMessage
const ShowMessageContext = createContext<ShowMessageContextType | undefined>(undefined);

export const ShowMessageProvider = ({ children }: { children: React.ReactNode }) => {
  const showMessage = useCallback((message: string, type: ShowMessageType|string = 'info') => {
    let messageContainer = document.getElementById('message-container');

    if (!messageContainer) {
      messageContainer = document.createElement('div');
      messageContainer.id = 'message-container';
      messageContainer.style.cssText = `
        position: fixed;
        top: 120px;
        right: 20px;
        max-width: 300px;
        font-size: large;
        z-index: 9999;
        font-family: sans-serif;
      `;
      document.body.appendChild(messageContainer);
    }

    const messageElement = document.createElement('div');
    messageElement.textContent = message;

    messageElement.style.cssText = `
      margin-bottom: 10px;
      padding: 15px 20px;
      border-radius: 6px;
      color: white;
      backdrop-filter: blur(5px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      opacity: 1;
      transition: opacity 2s ease;
    `;

    switch (type) {
      case 'error':
        messageElement.style.background = 'rgba(255, 0, 0, 0.6)';
        break;
      case 'warning':
        messageElement.style.background = 'rgba(214, 130, 20, 0.6)';
        break;
      case 'success':
        messageElement.style.background = 'rgba(0, 128, 0, 0.5)';
        break;
      case 'info':
      default:
        messageElement.style.background = 'rgba(0, 102, 204, 0.5)';
        break;
    }

    messageContainer.appendChild(messageElement);

    setTimeout(() => {
      messageElement.style.opacity = '0';
      setTimeout(() => {
        if (messageElement.parentNode) {
          messageElement.remove();
        }
      }, 2000);
    }, 5000);
  }, []);

  // New confirmMessage function - fixed parameter type
  const confirmMessage = useCallback((
    message: string, 
    type: ShowMessageType|string = 'info', 
    callback?: (confirmed: boolean) => void
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      // Create or get the confirmation container
      let confirmContainer = document.getElementById('confirm-container');
      
      if (confirmContainer) {
        // Remove any existing confirmation dialogs
        confirmContainer.remove();
      }
      
      confirmContainer = document.createElement('div');
      confirmContainer.id = 'confirm-container';
      confirmContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        font-family: sans-serif;
      `;
      
      const confirmDialog = document.createElement('div');
      confirmDialog.style.cssText = `
        width: 300px;
        background-color: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        animation: fadeIn 0.3s ease;
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `;
      
      // Header with colored background based on type
      const header = document.createElement('div');
      header.style.cssText = `
        color: white;
        padding: 15px;
        font-weight: bold;
      `;
      
      switch (type) {
        case 'error':
          header.style.background = 'rgba(255, 0, 0, 0.8)';
          break;
        case 'warning':
          header.style.background = 'rgba(214, 130, 20, 0.8)';
          break;
        case 'success':
          header.style.background = 'rgba(0, 128, 0, 0.8)';
          break;
        case 'info':
        default:
          header.style.background = 'rgba(0, 102, 204, 0.8)';
          break;
      }
      
      header.textContent = 'Confirmation';
      confirmDialog.appendChild(header);
      
      // Message content
      const content = document.createElement('div');
      content.style.cssText = `
        padding: 20px;
        color: #333;
      `;
      content.textContent = message;
      confirmDialog.appendChild(content);
      
      // Button container
      const buttonContainer = document.createElement('div');
      buttonContainer.style.cssText = `
        display: flex;
        padding: 10px 20px 20px;
        justify-content: flex-end;
        gap: 10px;
      `;
      
      // Cancel button
      const cancelButton = document.createElement('button');
      cancelButton.textContent = 'Cancel';
      cancelButton.style.cssText = `
        padding: 8px 16px;
        border: 1px solid #ccc;
        border-radius: 4px;
        background-color: #f5f5f5;
        cursor: pointer;
        transition: background-color 0.2s;
        
        &:hover {
          background-color: #e0e0e0;
        }
      `;
      
      // OK button
      const okButton = document.createElement('button');
      okButton.textContent = 'OK';
      okButton.style.cssText = `
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        color: white;
        cursor: pointer;
        transition: background-color 0.2s;
      `;
      
      // Set OK button color based on message type
      switch (type) {
        case 'error':
          okButton.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
          break;
        case 'warning':
          okButton.style.backgroundColor = 'rgba(214, 130, 20, 0.8)';
          break;
        case 'success':
          okButton.style.backgroundColor = 'rgba(0, 128, 0, 0.8)';
          break;
        case 'info':
        default:
          okButton.style.backgroundColor = 'rgba(0, 102, 204, 0.8)';
          break;
      }
      
      // Event handlers for buttons
      cancelButton.onclick = () => {
        confirmContainer.remove();
        if (callback) callback(false);
        resolve(false);
      };
      
      okButton.onclick = () => {
        confirmContainer.remove();
        if (callback) callback(true);
        resolve(true);
      };
      
      // Add buttons to container
      buttonContainer.appendChild(cancelButton);
      buttonContainer.appendChild(okButton);
      confirmDialog.appendChild(buttonContainer);
      
      // Add dialog to container and container to document
      confirmContainer.appendChild(confirmDialog);
      document.body.appendChild(confirmContainer);
      
      // Focus on OK button by default
      okButton.focus();
      
      // Close on Escape key
      document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
          document.removeEventListener('keydown', escHandler);
          cancelButton.click();
        } else if (e.key === 'Enter') {
          document.removeEventListener('keydown', escHandler);
          okButton.click();
        }
      });
    });
  }, []);

  return (
    <ShowMessageContext.Provider value={{ showMessage, confirmMessage }}>
      {children}
    </ShowMessageContext.Provider>
  );
};

export const useShowMessage = () => {
  const context = useContext(ShowMessageContext);
  if (!context) throw new Error('useMessage must be used within a ShowMessageProvider');
  return context;
};