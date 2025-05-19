'use client';

import { useEffect } from 'react';
import { CodeBlock } from './CodeBlock';

export function CodeBlockWrapper() {
  useEffect(() => {
    const codeBlocks = document.querySelectorAll('.code-block');
    codeBlocks.forEach((block) => {
      const language = block.getAttribute('data-language');
      const code = decodeURIComponent(block.getAttribute('data-code') || '');
      
      // Create a new CodeBlock component
      const codeBlockElement = document.createElement('div');
      codeBlockElement.innerHTML = `
        <div class="relative group">
          <pre class="p-4 rounded-lg bg-muted overflow-x-auto">
            <code class="language-${language}">${code}</code>
          </pre>
          <button class="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-background hover:bg-muted rounded-md flex items-center justify-center" onclick="copyCode(this)">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            </svg>
          </button>
        </div>
      `;
      
      // Replace the placeholder with the actual code block
      block.parentNode?.replaceChild(codeBlockElement, block);
    });
  }, []);

  return null;
}

// Add the copy function to the window object
declare global {
  interface Window {
    copyCode: (button: HTMLButtonElement) => void;
  }
}

window.copyCode = async (button: HTMLButtonElement) => {
  const code = button.parentElement?.querySelector('code')?.textContent || '';
  await navigator.clipboard.writeText(code);
  
  // Show copied state
  const originalHTML = button.innerHTML;
  button.innerHTML = `
    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M20 6L9 17l-5-5"></path>
    </svg>
  `;
  
  setTimeout(() => {
    button.innerHTML = originalHTML;
  }, 2000);
}; 