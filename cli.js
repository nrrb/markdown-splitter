#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { splitMarkdownToHtml } = require('./md-splitter');

// Parse command line arguments
const args = process.argv.slice(2);
let inputFile = '';
let outputDir = 'output-html';
let baseTitle = 'Documentation';
let syntaxHighlight = true; // default to true

// Process arguments
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--input' || args[i] === '-i') {
    inputFile = args[i + 1];
    i++;
  } else if (args[i] === '--output' || args[i] === '-o') {
    outputDir = args[i + 1];
    i++;
  } else if (args[i] === '--title' || args[i] === '-t') {
    baseTitle = args[i + 1];
    i++;
  } else if (args[i] === '--no-syntax-highlight') {
    syntaxHighlight = false;
  } else if (args[i] === '--help' || args[i] === '-h') {
    showHelp();
    process.exit(0);
  } else if (!inputFile) {
    // If no explicit input flag, treat as input file
    inputFile = args[i];
  }
}

// Show help if no input file specified
if (!inputFile) {
  console.error('Error: Input file is required.');
  showHelp();
  process.exit(1);
}

// Check if input file exists
if (!fs.existsSync(inputFile)) {
  console.error(`Error: Input file "${inputFile}" does not exist.`);
  process.exit(1);
}

// Perform the conversion
try {
  splitMarkdownToHtml(inputFile, outputDir, baseTitle, { syntaxHighlight });
  console.log(`\nConversion complete! Open ${path.join(outputDir, 'index.html')} in your browser to view the result.`);
} catch (error) {
  console.error('Error during conversion:', error);
  process.exit(1);
}

/**
 * Displays help information
 */
function showHelp() {
  console.log(`
Markdown Splitter - Convert a Markdown file into multiple linked HTML files

Usage:
  md-split [options] <input-file>

Options:
  -i, --input <file>     Input Markdown file
  -o, --output <dir>     Output directory for HTML files (default: "output-html")
  -t, --title <title>    Base title for HTML documents (default: "Documentation")
  --no-syntax-highlight Disable syntax highlighting in code blocks (default: enabled)
                        Note: Syntax highlighting requires internet connection for
                        viewers as it loads Prism.js from a CDN
  -h, --help            Show this help message

Example:
  md-split -i documentation.md -o docs-html -t "API Documentation"
  `);
}