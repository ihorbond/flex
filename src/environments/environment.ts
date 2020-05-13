// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
      apiKey: "AIzaSyBm2i1bLNOsLblixEog2Czv_ryAb_6fWoI",
      authDomain: "flex-6e95e.firebaseapp.com",
      databaseURL: "https://flex-6e95e.firebaseio.com",
      projectId: "flex-6e95e",
      storageBucket: "flex-6e95e.appspot.com",
      messagingSenderId: "669812144624",
      appId: "1:669812144624:web:7f43960ea8d86e38e30535",
      measurementId: "G-4MGCM8B6PQ"
  },
  testUserId: 'ynlfVJk02V8HnhB82ZH4',
  collections: {
    chatRooms: 'ChatRooms',
    users: 'Users',
    events: 'Events'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
