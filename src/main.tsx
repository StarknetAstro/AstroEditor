import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {ThemeProvider} from "@/components/theme-provider.tsx";
import { Analytics } from '@vercel/analytics/react';
import {createHashRouter, RouterProvider} from "react-router-dom";

const router = createHashRouter([
    {
        path: "/",
        element: <App/>,
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
          <RouterProvider router={router}/>
          <Analytics/>
      </ThemeProvider>
  </React.StrictMode>,
)
