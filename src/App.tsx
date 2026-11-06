import { Helmet } from "react-helmet-async"
import { RouterProvider } from "react-router-dom"
import { router } from "@/routes/router"

function App() {
  return (
    <>
      <Helmet>
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta
          name="description"
          content="Mr Khan Movers - Professional waste removal and clearance services across London. Fast, reliable, and eco-friendly."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href="https://mrkhanwasteremovallondon.co.uk/" />
      </Helmet>
      <RouterProvider router={router} />
    </>
  )
}

export default App
