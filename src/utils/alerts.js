import {Alert} from 'react-native';

export const showConfirmAlert = (title, message, confirmFun, id) => {
  Alert.alert(
    title, message, 
    [
        {text: 'OK', onPress:() => confirmFun(id)},
        {text: 'CANCEL', onPress:() => console.log("Didn't deleted")},
    ]
    );
};
export const showSaveChangesAlert = (title, message, confirmFun) => {
  Alert.alert(
    title, message, 
    [
        {text: 'OK', onPress:() => confirmFun()},
        {text: 'CANCEL', onPress:() => console.log("Didn't deleted")},
    ]
    );
};

