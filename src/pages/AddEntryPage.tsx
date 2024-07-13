import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTextarea,
  IonTitle,
  IonToolbar,
  isPlatform,
  setupIonicReact,
} from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import { firestore, storage } from "../firebase";
import { useAuth } from "../auth";
import { useHistory } from "react-router";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

setupIonicReact();

async function savePicture(blobUrl: any, userId: any) {
  const pictureRef = storage.ref(`users/${userId}/pictures/${Date.now()}`);
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  const snapshot = await pictureRef.put(blob);
  const url = (await snapshot).ref.getDownloadURL();
  console.log("saved url", url);
  return url;
}

const AddEntryPage: React.FC = () => {
  const { userId } = useAuth();
  const history = useHistory();
  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [pictureUrl, setPictureUrl] = useState("/assets/placeholder.png");
  const [description, setDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(
    () => () => {
      if (pictureUrl.startsWith("blob")) {
        URL.revokeObjectURL(pictureUrl);
      }
    },
    [pictureUrl]
  );
  const handleFileChange = (event: any) => {
    if (event.target.files.length > 0) {
      const file = event.target.files.item(0);
      const pictureUrl = URL.createObjectURL(file);
      setPictureUrl(pictureUrl);
    }
  };

  const handlePictureClick = async () => {
    if (isPlatform("capacitor")) {
      try {
        const photo = await Camera.getPhoto({
          resultType: CameraResultType.Uri,
          source: CameraSource.Prompt,
        });
        console.log("url", photo.webPath);
        setPictureUrl(photo.webPath as string);
      } catch (error) {
        console.log("Camera error", error);
      }
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleSave = async () => {
    const entriesRef = firestore
      .collection("users")
      .doc(userId)
      .collection("entries");
    const entryData = { date, title, pictureUrl, description };
    if (!pictureUrl.startsWith("/assets")) {
      entryData.pictureUrl = await savePicture(pictureUrl, userId);
    }
    const entryRef = await entriesRef.add(entryData);
    console.log("saved", entryRef.id);
    history.goBack();
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Add Entry</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonInput
              label="Date"
              labelPlacement="stacked"
              type="date"
              value={date}
              onIonChange={(event) => setDate(event.detail.value as string)}
            />
          </IonItem>
          <IonItem>
            <IonInput
              label="Title"
              labelPlacement="stacked"
              value={title}
              onIonChange={(event) => setTitle(event.detail.value as string)}
            />
          </IonItem>
          <IonItem>
            <IonTextarea
              label="Description"
              labelPlacement="stacked"
              value={description}
              onIonChange={(event) =>
                setDescription(event.detail.value as string)
              }
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Picture</IonLabel>
            <br />
            <input
              type="file"
              accept="image/*"
              hidden
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <img
              src={pictureUrl}
              alt=""
              height="200px"
              width="300px"
              style={{ cursor: "pointer" }}
              onClick={handlePictureClick}
            />
          </IonItem>
        </IonList>
        <IonButton expand="block" onClick={handleSave}>
          Save
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default AddEntryPage;
