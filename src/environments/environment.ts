// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  BASE_URL: "http://localhost:5000",
  APP_ID: "30571d04-c9ec-4aa2-9f0a-d82c37ea237f",
  firebase: {
    apiKey: "AIzaSyAzpPvyzAjfRtMMi-L4DzaXHs75Bmm7Ils",
    authDomain: "doing-backend.firebaseapp.com",
    databaseURL: "https://doing-backend.firebaseio.com",
    projectId: "doing-backend",
    storageBucket: "doing-backend.appspot.com",
    messagingSenderId : "1077454385497"
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
