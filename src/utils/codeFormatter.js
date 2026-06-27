import beautify from 'js-beautify';

/**
 * Detect language based on simple syntax heuristics
 * @param {string} code 
 * @returns {'json' | 'html' | 'css' | 'js'}
 */
export function detectLanguage(code) {
  if (!code) return 'js';
  const trimmed = code.trim();
  
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      JSON.parse(trimmed);
      return 'json';
    } catch (e) {
      // It looks like JSON, return json anyway so user can see it fails validation
      return 'json';
    }
  }
  
  if (/<[a-z/][\s\S]*>/i.test(trimmed)) {
    return 'html';
  }
  
  if (/^[.#a-zA-Z-:\s]+{[^}]+}/.test(trimmed) || /^\s*@[a-zA-Z-]+\s+[^}]+}/.test(trimmed)) {
    return 'css';
  }
  
  return 'js';
}

/**
 * Format a code snippet using js-beautify or JSON stringify
 * @param {string} code 
 * @param {'auto' | 'js' | 'html' | 'css' | 'json'} language 
 * @returns {string} Formatted code
 */
export function formatCodeSnippet(code, language = 'auto') {
  if (!code) return '';
  const trimmed = code.trim();
  
  const targetLang = language === 'auto' ? detectLanguage(trimmed) : language;

  try {
    if (targetLang === 'json') {
      return JSON.stringify(JSON.parse(trimmed), null, 2);
    }
    
    if (targetLang === 'html') {
      return beautify.html(trimmed, {
        indent_size: 2,
        indent_char: ' ',
        max_preserve_newlines: 2,
        preserve_newlines: true,
        wrap_line_length: 120,
        unformatted: ['code', 'pre', 'em', 'strong', 'span', 'a'],
      });
    }
    
    if (targetLang === 'css') {
      return beautify.css(trimmed, {
        indent_size: 2,
        indent_char: ' ',
        max_preserve_newlines: 2,
        preserve_newlines: true,
      });
    }
    
    // Default to JavaScript/TypeScript/JSX
    return beautify.js(trimmed, {
      indent_size: 2,
      indent_char: ' ',
      max_preserve_newlines: 2,
      preserve_newlines: true,
      space_in_empty_paren: true,
      e4x: true, // Support JSX/XML formatting inside JavaScript
    });
  } catch (err) {
    console.error('Failed to format code snippet:', err);
    // If it failed to format (e.g. invalid JSON syntax), we try standard JS formatting as fallback
    try {
      return beautify.js(trimmed, {
        indent_size: 2,
        indent_char: ' ',
        max_preserve_newlines: 2,
        preserve_newlines: true,
        space_in_empty_paren: true,
        e4x: true,
      });
    } catch (e) {
      return code; // Ultimate fallback: return original code
    }
  }
}
