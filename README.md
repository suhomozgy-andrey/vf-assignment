# This is a Veriff test assignment

API was taken from the [veriff-assignment](https://codesandbox.io/s/veriff-assignment-9lvph).

#### Notes

Since original `api.js` included `fetchChecks` responding with data when the following condition is `true` - `Math.random() <= 0.8`, initial data loading might fall into error state.

Same is for result submission - if `Math.random() <= 0.8` is `false` you will se an error message.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
