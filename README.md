# React Axios Interceptor

This project is a React application bootstrapped with Vite & typescript, featuring an Axios interceptor that provides enhanced request and response handling capabilities.

## GitHub Repository

[GitHub Repository](https://github.com/sai-teja-git/react-axios-interceptor.git)

## Description

The Axios interceptor in this project serves the following purposes:

- **Intercepting All Requests:** It intercepts all outgoing requests, allowing modifications to request headers and bodies.
- **Request Modification:** You can encrypt request bodies before they are sent and modify request headers as needed.
- **Response Handling:** Decrypt response data upon receiving it.
- **Token Management:** If an access token has expired, any request that fails due to this reason is queued. Once a new access token is obtained, all queued requests are retried with the new token.

## Getting Started

### Prerequisites

Make sure you have the following installed on your local development environment:

- Node.js (version 14 or higher)
- npm (version 6 or higher)

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/sai-teja-git/react-axios-interceptor.git
   ```

2. Navigate to the project directory:

   ```sh
   cd react-axios-interceptor
   ```

3. Install the dependencies:
   ```sh
   npm install
   ```

### Running the Application

To start the development server, run:

```sh
npm run dev
```

The application will be available at `http://localhost:9200`.

### Building for Production

To build the application for production, run:

```sh
npm run build
```

### Server

1. Clone the repository:

   ```sh
   git clone https://github.com/sai-teja-git/nest-js-functionality.git
   ```

2. Navigate to the project directory:

   ```sh
   cd nest-js-functionality
   ```

3. Install the dependencies:
   ```sh
   npm install
   ```
4. To start the development server, run:
   ```sh
   npm run start:dev
   ```

The production-ready files will be generated in the `dist` directory.

## Axios Interceptor Details

The Axios interceptor is implemented in the `src/interceptors/axios.interceptor.ts` directory and includes the following functionality:

- **Request Interception:** Encrypt request bodies and modify headers before sending requests.
- **Response Interception:** Decrypt response data upon receiving it.
- **Token Handling:** Detect token expiration and queue failed requests. Retry all failed requests once a new token is obtained.

### Example Usage

Here is an example of how to use the Axios interceptor in your components:

import axios modified functions in your `App.tsx`

```tsx
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import globalRouter from "./services/globalRouter.service";
import { setupInterceptorsTo } from "./interceptors/axios.interceptor";
import axios from "axios";
import { lazy } from "react";
import { PrivateRoute } from "./components/PrivateRoute";

setupInterceptorsTo(axios);

const Data = lazy(() => import("./pages/Data"));

function App() {
  const navigate = useNavigate();
  globalRouter.navigate = navigate;

  return (
    <>
      <Routes>
        <Route path="" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="data" element={<Data />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
```

In your component

```tsx
import axios from "axios";
import { useEffect } from "react";

const ExampleComponent = () => {
  useEffect(() => {
    axios
      .get("/api/example")
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h1>Example Component</h1>
    </div>
  );
};

export default ExampleComponent;
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

This README provides a comprehensive overview of the React + Vite Axios Interceptor project, detailing its purpose, setup, and usage. For more information, please refer to the [source code in the repository](https://github.com/sai-teja-git/react-axios-interceptor).
