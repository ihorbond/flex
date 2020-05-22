import * as functions from 'firebase-functions';

import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);


exports.newNotification = functions.firestore
    .document('Users/{uId}/Notifications/{nId}')
    .onCreate(async snapshot => {
        const user = snapshot.ref.parent.parent;
        const data = snapshot.data();
        
        const payload = {
            notification: {
                title: data?.title,
                body: data?.body,
                icon: data?.icon
            }
        };

        console.log(user, payload);

        const devices = await user?.collection('devices').get();
        const tokens: string[] = [];
        devices?.forEach(d => tokens.push(d.data().token));

        return admin.messaging().sendToDevice(tokens, payload);
    });