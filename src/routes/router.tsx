import { createBrowserRouter } from "react-router-dom"
import { MainLayout } from "@/layouts/MainLayout"
import { Home } from "@/pages/Home"
import { About } from "@/pages/About"
import { Services } from "@/pages/Services"
import { ServiceDetail } from "@/pages/services/ServiceDetail"
import { Areas } from "@/pages/Areas"
import { LocationDetail } from "@/pages/locations/LocationDetail"
import { Contact } from "@/pages/Contact"
import { NotFound, Privacy, SitemapPage, Terms } from "@/pages/Legal"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "services", element: <Services /> },
      { path: "services/:id", element: <ServiceDetail /> },
      { path: "areas", element: <Areas /> },
      { path: "areas/:id", element: <LocationDetail /> },
      { path: "contact", element: <Contact /> },
      { path: "privacy", element: <Privacy /> },
      { path: "terms", element: <Terms /> },
      { path: "sitemap", element: <SitemapPage /> },
      { path: "*", element: <NotFound /> },
    ],
  },
])
