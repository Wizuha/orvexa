import { RoleProvider } from "../context/RoleContext";
import Layout from "../components/Layout";
import "../styles/globals.css";

const PUBLIC_ROUTES = ["/"];

export default function App({ Component, pageProps, router }) {
  const isPublic = PUBLIC_ROUTES.includes(router.pathname);

  return (
    <RoleProvider>
      {isPublic ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </RoleProvider>
  );
}
