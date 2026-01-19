/**
 * Home Page - Displays project README.md
 *
 * This template home page reads and displays the project's README.md file
 * Replace this with your actual homepage implementation
 */

import { promises as fs } from 'fs';
import path from 'path';

export default async function HomePage() {
  // Read README.md from project root (one level up from web folder)
  const readmePath = path.join(process.cwd(), '..', 'README.md');

  let readmeContent = '';
  try {
    readmeContent = await fs.readFile(readmePath, 'utf8');
  } catch {
    readmeContent = '# Welcome\n\nNo README.md file found in project root.';
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="prose prose-slate lg:prose-lg max-w-none">
        <div
          className="readme-content"
          // security-ignore: Content is from project's own README.md file (server-side filesystem), not user input
          dangerouslySetInnerHTML={{
            __html: convertMarkdownToHtml(readmeContent),
          }}
        />
      </div>
    </div>
  );
}

/**
 * Simple markdown to HTML converter
 * Handles basic markdown syntax - for production consider using a proper markdown library
 */
function convertMarkdownToHtml(markdown: string): string {
  let html = markdown;

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/gim,
    '<a href="$2" class="text-blue-600 hover:text-blue-800 underline">$1</a>',
  );

  // Line breaks
  html = html.replace(/\n\n/gim, '</p><p>');
  html = '<p>' + html + '</p>';

  // Code blocks
  html = html.replace(
    /```([^`]+)```/gim,
    '<pre class="bg-gray-100 p-4 rounded overflow-x-auto"><code>$1</code></pre>',
  );

  // Inline code
  html = html.replace(
    /`([^`]+)`/gim,
    '<code class="bg-gray-100 px-2 py-1 rounded text-sm">$1</code>',
  );

  return html;
}
