import {Alert} from 'react-native';

export const showConfirmAlert = (title, message, confirmFun, id, t) => {
  Alert.alert(
    title, message, 
    [
        {text: t("Alert_Confirm_Delete"), onPress:() => confirmFun(id)},
        {text: t("Alert_Cancel"), onPress:() => console.log("Didn't deleted")},
    ]
    );
};
export const showSaveChangesAlert = (title, message, confirmFun) => {
  Alert.alert(
    title, message, 
    [
        {text: 'OK', onPress:() => confirmFun()},
        {text: t("Alert_Cancel"), onPress:() => console.log("Didn't edited")},
    ]
    );
};

