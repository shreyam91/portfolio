'use client';

import { useEffect, useState } from 'react';
import { CodeBlock } from './CodeBlock';

export function CodeBlockWrapper() {
  const [codeBlocks, setCodeBlocks] = useState<Array<{language: string; code: string}>>([]);

  useEffect(() => {
    const blocks = document.querySelectorAll('.code-block');
    const blockData: Array<{language: string; code: string}> = [];
    
    blocks.forEach((block) => {
      const language = block.getAttribute('data-language') || 'text';
      const code = decodeURIComponent(block.getAttribute('data-code') || '');
      blockData.push({
        language,
        code
      });
    });
    
    setCodeBlocks(blockData);
  }, []);

  return (
    <>
      {codeBlocks.map((block, index) => (
        <CodeBlock
          key={index}
          language={block.language}
          code={block.code}
        />
      ))}
    </>
  );
} 