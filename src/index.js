import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import Root from "./routes/root";
import Native from "./routes/native";
import Wasm from "./routes/wasm";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />
    },

    {
        path: "native",
        element: <Native />
    },

    {
        path: "wasm",
        element: <Wasm />
    }
]);


ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
