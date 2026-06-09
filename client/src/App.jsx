import { AuthProvider } from "./components/context/AuthContext";
import AppRoutes from "./components/routes/AppRoutes";

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
