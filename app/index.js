import { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet, Text, Alert,ActivityIndicator } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import * as DocumentPicker from "expo-document-picker";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import {
  addDoc,
  collection,
  getFirestore,
} from "firebase/firestore";
import { app } from "../firebaseConfig";

const Home = () => {
  const [selectedValue, setSelectedValue] = useState([]);
  const [selectedEmotion, setSelectedEmption] = useState([]);
  const [emptionMargin, setEmpotionMargin] = useState(true);
  const [pickedFile, setPickedFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [eopen, setEopen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([
    { label: "40-50", value: 1 },
    { label: "51-60", value: 2 },
    { label: "61-70", value: 3 },
    { label: "71-80", value: 4 },
  ]);
  const [emptions, setEmotions] = useState([
    { label: "sad", value: "sad" },
    { label: "happy", value: "happy" },
    { label: "angry", value: "angry" },
    { label: "natural", value: "natural" },
  ]);
  const pickImage = () => {
    DocumentPicker.getDocumentAsync()
      .then((res) => {
        console.log(res.uri);
        setPickedFile(res);
      })
      .catch((err) => {
        console.log(`get document failed ${err}`);
      });
  };
  useEffect(() => {
    if (eopen) {
    }
    if (open) {
      setEmpotionMargin(false);
    } else {
      setEmpotionMargin(true);
    }
  }, [open, eopen]);

  const uploadFIile = async () => {
    setIsLoading(true);
    const response = await fetch(pickedFile.uri);
    const blob = await response.blob();

    const storage = getStorage();
    const storageRef = ref(storage, `/music_library/${pickedFile.name}`);

    await uploadBytes(storageRef, blob)
      .then(async (snapshot) => {
        console.log("Uploaded a blob or file!");
        const url = await getDownloadURL(storageRef);
        const data = {
          ageRange: selectedValue[0],
          artist: "",
          category: selectedEmotion[0],
          url,
        };
        const db = getFirestore(app);

        await addDoc(collection(db, "audio"), data)
          .then((snapshot) => {
            setSelectedEmption([]);
            setSelectedValue([]);
            Alert.alert("Great","Music file added successfully",[],{cancelable : true});
          })
          .catch((err) => {
            console.log(`set doc failed ${err}`);
          });
      })
      .catch((err) => {
        console.log(`upload file page ${err}`);
      });
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <View style={styleSheet.container}>
        <Text>Uploading ...</Text>
        <ActivityIndicator/>
      </View>
    );
  }

  return (
    <View style={styleSheet.container}>
      <Text style={styleSheet.label}>Age Range</Text>
      <DropDownPicker
        open={open}
        value={selectedValue}
        items={items}
        setOpen={setOpen}
        setValue={setSelectedValue}
        setItems={setItems}
        theme="DARK"
        multiple={true}
        mode="BADGE"
        badgeDotColors={[
          "#e76f51",
          "#00b4d8",
          "#e9c46a",
          "#e76f51",
          "#8ac926",
          "#00b4d8",
          "#e9c46a",
        ]}
      />
      <View
        style={{
          display: `${emptionMargin ? "flex" : "none"}`,
        }}
      >
        <Text style={styleSheet.label}>Emotion</Text>
        <DropDownPicker
          style={{
            marginVertical: 8,
          }}
          open={eopen}
          value={selectedEmotion}
          items={emptions}
          setOpen={setEopen}
          setValue={setSelectedEmption}
          setItems={setEmotions}
          theme="DARK"
          multiple={true}
          mode="BADGE"
          badgeDotColors={[
            "#e76f51",
            "#00b4d8",
            "#e9c46a",
            "#e76f51",
            "#8ac926",
            "#00b4d8",
            "#e9c46a",
          ]}
        />
      </View>
      <TouchableOpacity
        style={{
          ...styleSheet.button,
          display: `${emptionMargin ? "flex" : "none"}`,
        }}
        onPress={pickImage}
      >
        <Text style={styleSheet.buttonText}>Pick Audio</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          ...styleSheet.button,
          marginVertical: 8,
          display: `${emptionMargin ? "flex" : "none"}`,
        }}
        onPress={uploadFIile}
      >
        <Text style={styleSheet.buttonText}>Upload</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;

const styleSheet = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 16,
    alignItems :"center"
  },
  dropdownStyle: {},
  label: {
    fontSize: 18,
    marginVertical: 8,
  },
  button: {
    backgroundColor: "#00b4d8",
    paddingVertical: 8,
    height: 50,
    paddingHorizontal: 16,
    borderRadius: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 150,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
