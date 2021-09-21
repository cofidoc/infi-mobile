import { useHistory } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import {
  ReactNode,
  useContext,
  useEffect,
  useState,
  createContext,
} from "react";
import { doc, getDoc } from "@firebase/firestore";
import { Box } from "@mui/system";
import { Button, Typography } from "@mui/material";

type User = {
  email: string;
  firstname: string;
  lastname: string;
  officeIds: string[];
};

type AuthContextType = {
  user: User | undefined;
};

const authContext = createContext<AuthContextType>({
  user: undefined,
});

export function useAuth() {
  return useContext(authContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>();
  const [openModal, setOpenModal] = useState(false);
  const history = useHistory();

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userId = user.uid;
        const userRef = doc(db, "users", userId);
        const docSnap = await getDoc(userRef);
        const _user = docSnap.data() as User;
        setUser(_user);

        if (_user.officeIds?.length === 1) {
          const _officeId = _user.officeIds[0];
          history.push(`/offices/${_officeId}`);
        } else {
          setOpenModal(true);
        }
      } else {
        // User is signed out
        setUser(undefined);
        history.push("/login");
      }
    });
  }, [history]);

  if (openModal)
    return (
      <Box
        p={2}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography textAlign="center" mb={3}>
          Choissiez le cabinet auquelle vous voulez vous connecter
        </Typography>
        {user?.officeIds?.map((officeId) => (
          <Button
            variant="text"
            onClick={() => {
              setOpenModal(false);
              history.push(`/offices/${officeId}`);
            }}
          >
            {officeId}
          </Button>
        ))}
      </Box>
    );

  return (
    <authContext.Provider value={{ user }}>{children}</authContext.Provider>
  );
}
