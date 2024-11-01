// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

//  "http://localhost:44372/" will, basically, act as a ID Server gateway environment for all api call. Real world scenarios would probably varry
export const environment = {
  production: false,
  cryptoKey: '4139178281695088',
  registerUrl: 'http://localhost:53465/api/account/registeruser',
  loginUrl: 'http://localhost:53465/api/account/login',
  logoutUrl: 'http://localhost:53465/api/account/logout',
  resetCredentialsUrl: 'http://localhost:53465/api/account/resetusercreds',
  baseUrl: 'https://localhost:44372/api/',
  userUrlBase: 'https://localhost:44367/api/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
