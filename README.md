# REST Client Application

This project is a modern, visually appealing REST client application designed for developers to efficiently make, test, and manage HTTP requests.

## Technology Stack

*   **Frontend Framework**: React
*   **UI Components**: Shadcn/UI
*   **Styling**: Tailwind CSS
*   **State Management**: React Context or a lightweight state management library (e.g., Zustand)

## Features

The application provides the following core functionalities:

*   **HTTP Request Capabilities**: Supports GET, POST, PUT, DELETE, OPTIONS methods, URL input, and various request body formats (JSON, Multipart/Form-Data, Form URL Encoded, Raw Text).
*   **Headers & Query Parameters**: Allows users to add, edit, and remove custom HTTP headers and URL query parameters.
*   **Response Handling**: Displays status code, response headers, and body (with syntax highlighting), along with request time. Includes copy functionality for response body and headers.
*   **Request Management (Collections)**: Users can create named collections to group requests, save requests to collections, view/load/delete requests and collections.
*   **Theming**: Provides a toggle for light/dark mode with persistence.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
