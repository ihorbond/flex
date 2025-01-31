import * as functions from 'firebase-functions';

import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);


exports.newNotification = functions.firestore
    .document('Users/{uId}/Notifications/{nId}')
    .onCreate(async snapshot => {
        const user = snapshot.ref.parent.parent;
        const data = snapshot.data();
        
        const payload: admin.messaging.MessagingPayload = {
            notification: {
                title: data?.title,
                body: data?.body,
                icon: data?.icon
            },
            data: {
                notification_foreground: 'true',
                notification_title: data?.title,
                notification_body: data?.body,
                notification_icon: data?.icon
              }
        };

        const devices = await user?.collection('Devices').get();
        const tokens: string[] = [];
        devices?.forEach(d => tokens.push(d.data().token));

        return admin.messaging().sendToDevice(tokens, payload);
    });