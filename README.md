# My Postman 2026

A modern desktop HTTP client tool similar to Postman, built with React and Tauri.

## Features

- 🚀 **Fast & Native**: Built with Tauri for native performance
- 🎯 **HTTP Methods**: Support for GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS
- 📝 **Request Builder**: Easy-to-use interface for building HTTP requests
- 🔧 **Headers Management**: Add, edit, and remove request headers
- 📋 **Request Body**: Support for JSON, XML, text, and other body types
- 📊 **Response Viewer**: Formatted display of response body and headers
- 🕒 **Request History**: Keep track of all your API calls
- ⚡ **Keyboard Shortcuts**: Ctrl/Cmd + Enter to send requests
- 💾 **Persistent Storage**: History is automatically saved locally

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Rust](https://rustlang.org/) (for building the Tauri backend)

### Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/wizardleeen/my-postman-2026.git
   cd my-postman-2026
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run in development mode:
   ```bash
   npm run tauri:dev
   ```

### Building for Production

```bash
npm run tauri:build
```

This will create platform-specific installers in the `src-tauri/target/release/bundle/` directory.

## Usage

1. **Make a Request**:
   - Select HTTP method (GET, POST, etc.)
   - Enter the URL
   - Add headers if needed
   - Add request body for POST/PUT requests
   - Click "Send" or press Ctrl/Cmd + Enter

2. **View Response**:
   - Response body is automatically formatted (JSON)
   - View response headers
   - Check status code and response time

3. **Request History**:
   - All requests are automatically saved
   - Click on history items to reload them
   - Clear history when needed

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Desktop Framework**: Tauri
- **Backend**: Rust (reqwest for HTTP requests)
- **UI Icons**: Lucide React
- **Styling**: Pure CSS

## Project Structure

```
my-postman-2026/
├── src/                    # React frontend source
│   ├── components/         # React components
│   ├── types/             # TypeScript type definitions
│   └── App.tsx            # Main app component
├── src-tauri/             # Tauri backend (Rust)
│   ├── src/               # Rust source code
│   ├── Cargo.toml         # Rust dependencies
│   └── tauri.conf.json    # Tauri configuration
└── package.json           # Node.js dependencies
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Roadmap

- [ ] Environment variables support
- [ ] Request collections/folders
- [ ] API documentation generation
- [ ] Response caching
- [ ] Request authentication helpers
- [ ] Export/import collections
- [ ] Code generation (curl, etc.)
- [ ] WebSocket support
- [ ] GraphQL support

## Screenshots

*Screenshots will be added once the application is built and running.*