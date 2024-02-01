import {StatusBar} from 'expo-status-bar';
import {Pressable, StyleSheet, Text, View, Image} from 'react-native';
import {FileSystemSessionType, FileSystemUploadType, uploadAsync} from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import {useCallback, useState} from "react";

export default function App() {
    const [selectedImageUri, setSelectedImageUri] = useState(null)
    const [lastUploadSuccess, setLastUploadSuccess] = useState(null)
    const openImagePicker = useCallback(async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            quality: 1,
            allowsMultipleSelection: true,
        });
        if (result.canceled) {
            return
        }
        const imageUri = result.assets[0].uri
        console.log("Chosen Image URI:", imageUri)
        setSelectedImageUri(imageUri);
    }, [])

    const uploadImage = useCallback(async () => {
        setLastUploadSuccess(null);
        try {
            const uploadResult = await uploadAsync("https://api.cloudinary.com/v1_1/questmate-testing/auto/upload", selectedImageUri, {
                httpMethod: "POST",
                sessionType: FileSystemSessionType.BACKGROUND,
                uploadType: FileSystemUploadType.MULTIPART,
                fieldName: "file",
                parameters: {},
            })
            console.log("Upload success! Result:", JSON.stringify(uploadResult, null, 2))
            setLastUploadSuccess(true);
        } catch (e) {
            console.log("Upload failed! Error:", e, JSON.stringify(e, null, 2))
            setLastUploadSuccess(false);
        }
    }, [selectedImageUri])

    return (
        <View style={styles.container}>
            <Pressable style={styles.button} onPress={openImagePicker}><Text style={styles.buttonText}>Choose an
                image</Text></Pressable>
            {selectedImageUri ? (
                <>
                    <Image source={{uri: selectedImageUri}} style={{width: 200, height: 200}}/>
                    <Pressable style={styles.button} onPress={uploadImage}><Text style={styles.buttonText}>Upload
                        Image</Text></Pressable>
                </>
            ) : null}
            {lastUploadSuccess === true ? (
                <Text>✅ Upload Successful!</Text>
            ) : lastUploadSuccess === false ? (
                <Text>❌ Upload Failed. See logs for error message.</Text>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        width: 200,
        borderRadius: 8,
        backgroundColor: "#000",
        padding: 10,
        margin: 20,
        alignItems: 'center'
    },
    buttonText: {
        color: '#fff'
    }
});
