// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    hmr       : false,
    // apiUrl: 'https://api.demo.staffconnect-app.com/api',
    apiUrl:   'http://localhost:8000/api',
    socketServerUrl: 'wss://staffconnect-app.herokuapp.com',
    // socketServerUrl: 'wss://67.225.138.133:8080'
    // socketServerUrl: 'ws://localhost:8080'
};
