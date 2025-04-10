import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { CredentialsProvider } from "./context/CredentialsContext";
import Layout from "./components/Layout";
import FilesPage from "./pages/FilesPage";
import UploadPage from "./pages/UploadPage";
import TransactionsPage from "./pages/TransactionsPage";

export default function App() {
  return (
    <CredentialsProvider>
      <Layout>
        <Switch>
          <Route path="/" component={FilesPage} />
          <Route path="/upload" component={UploadPage} />
          <Route path="/transactions" component={TransactionsPage} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
      <Toaster />
    </CredentialsProvider>
  );
}
