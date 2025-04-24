# Markdown Splitter

A tool that splits a Markdown file on header tags into a series of rendered HTML files. Each HTML file links to the previous and next file and includes a drop-down table of contents in the top menu bar.

## Features

- Split Markdown files into multiple HTML files based on heading tags
- Each HTML file includes:
  - Links to previous and next sections
  - A dropdown table of contents with links to all sections
  - Clean, responsive styling
- Automatic index.html that redirects to the first section

## Installation

### Option 1: Local Installation

1. Clone this repository:
   ```
   git clone https://github.com/nrrb/markdown-splitter.git
   cd markdown-splitter
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Link the command globally:
   ```
   npm link
   ```

### Option 2: Install from npm

```
npm install -g @beautifullife/markdown-splitter
```

## Usage

### Command Line

```
md-split [options] <input-file>
```

Options:
- `-i, --input <file>`: Input Markdown file
- `-o, --output <dir>`: Output directory for HTML files (default: "output-html")
- `-t, --title <title>`: Base title for HTML documents (default: "Documentation")
- `--no-syntax-highlight`: Disable syntax highlighting in code blocks (default: enabled)
  - Note: When syntax highlighting is enabled (default), the generated HTML files will load Prism.js from a CDN
  - Viewers will need an internet connection to see syntax highlighting
  - Disable this option if you need the documentation to work completely offline
- `-h, --help`: Show help information

Example:
```
md-split -i documentation.md -o docs-html -t "API Documentation"
```

### Programmatically

```javascript
const { splitMarkdownToHtml } = require('markdown-splitter');

// Split a Markdown file into multiple HTML files
splitMarkdownToHtml('input.md', 'output-dir', 'Document Title');
```

## Example Output

After running the tool, you'll get:

1. An `index.html` file that redirects to the first section
2. Multiple HTML files named after each section ID (derived from heading text)
3. Each HTML file contains:
   - The section content
   - Navigation links to previous/next sections
   - A dropdown table of contents

Open the `index.html` file in your browser to start browsing the documentation.

## Requirements

- Node.js 12.x or higher
- npm or yarn

## License

MIT