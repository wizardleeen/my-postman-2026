# My Postman 2026

A modern web-based HTTP client tool similar to Postman, built with React and TypeScript.

## Features

- 🚀 **Fast & Lightweight**: Pure web application, no desktop installation needed
- 🎯 **HTTP Methods**: Support for GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS
- 📝 **Request Builder**: Easy-to-use interface for building HTTP requests
- 🔧 **Headers Management**: Add, edit, and remove request headers
- 📋 **Request Body**: Support for JSON, XML, text, and other body types
- 📊 **Response Viewer**: Formatted display of response body and headers
- 🕒 **Request History**: Keep track of all your API calls
- ⚡ **Keyboard Shortcuts**: Ctrl/Cmd + Enter to send requests
- 💾 **Persistent Storage**: History is automatically saved in browser storage
- 🌍 **CORS-Enabled Examples**: Built-in examples of public APIs you can test

## Live Demo

🔗 **[Try it now: https://my-postman-2026.kyvy.me](https://my-postman-2026.kyvy.me)**

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

3. **Try Examples**:
   - Click on any example API in the sidebar
   - Includes JSONPlaceholder, HTTPBin, Cat Facts, and more
   - All examples are CORS-enabled and ready to test

4. **Request History**:
   - All requests are automatically saved
   - Click on history items to reload them
   - Clear history when needed

## CORS Considerations

Since this is a web-based tool, it's subject to browser CORS (Cross-Origin Resource Sharing) policies. Some APIs may not work directly due to CORS restrictions. The tool includes:

- Built-in CORS error detection and warnings
- Curated list of CORS-enabled public APIs for testing
- Clear error messages when CORS issues occur

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **HTTP Client**: Fetch API
- **UI Icons**: Lucide React
- **Styling**: Pure CSS
- **Deployment**: Static hosting

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/wizardleeen/my-postman-2026.git
   cd my-postman-2026
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
my-postman-2026/
├── src/
│   ├── components/         # React components
│   │   ├── RequestPanel.tsx   # Request configuration UI
│   │   ├── ResponsePanel.tsx  # Response display UI
│   │   └── Sidebar.tsx        # History and examples
│   ├── types/             # TypeScript type definitions
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # App entry point
│   └── index.css          # Global styles
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
└── vite.config.ts         # Vite configuration
```

## Example APIs to Test

The tool comes with built-in examples of CORS-enabled APIs:

- **JSONPlaceholder**: Fake REST API for testing
- **HTTPBin**: HTTP request & response service
- **Cat Facts API**: Random cat facts
- **REST Countries**: Country information API
- **And more**: Click on examples in the sidebar to try them

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
- [ ] Export/import collections
- [ ] Code generation (curl, JavaScript, Python, etc.)
- [ ] Response caching
- [ ] Request authentication helpers
- [ ] GraphQL support
- [ ] WebSocket support
- [ ] Dark mode
- [ ] Request templates

---

**Note**: This is a web-based HTTP client. For APIs that don't support CORS, consider using:
- Browser extensions that disable CORS (for development only)
- CORS proxy services
- Desktop HTTP clients like the original Postman
- Server-side API testing tools