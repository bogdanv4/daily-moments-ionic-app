import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonLoading,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  setupIonicReact,
} from "@ionic/react";
import { Redirect } from "react-router";
import { auth } from "../firebase";
import { useState } from "react";
import { useAuth } from "../auth";

setupIonicReact();
// interface Props {
//   loggedIn: boolean;
// }

const RegisterPage: React.FC = () => {
  const { loggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState({ loading: false, error: false });
  const handleRegister = async () => {
    try {
      setStatus({ loading: true, error: false });
      const credentials = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      console.log("credentials: ", credentials);
    } catch (error) {
      setStatus({ loading: false, error: true });
      console.log("error:", error);
    }
  };

  if (loggedIn) {
    return <Redirect to="/my/entries" />;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Register</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonInput
              label="Email"
              labelPlacement="stacked"
              type="email"
              value={email}
              onIonChange={(event) => setEmail(event.detail.value as string)}
            />
          </IonItem>
          <IonItem>
            <IonInput
              label="Password"
              labelPlacement="stacked"
              type="password"
              value={password}
              onIonChange={(event) => setPassword(event.detail.value as string)}
            />
          </IonItem>
        </IonList>
        {status.error && (
          <IonText color={"danger"}>Registration failed</IonText>
        )}
        <IonButton expand="block" onClick={handleRegister}>
          Create Account
        </IonButton>
        <IonButton fill="clear" expand="block" routerLink="/login">
          Login with an existing account
        </IonButton>
        <IonLoading isOpen={status.loading}></IonLoading>
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;
