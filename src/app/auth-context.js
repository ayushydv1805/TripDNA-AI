import { createContext } from "react";

const AuthContext = createContext({
  user: null,
  loading: false,
  cloudStatus: "local",
  firebaseConfigured: false,
  logout: async () => {},
});

export default AuthContext;
