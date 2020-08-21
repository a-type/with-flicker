# with-flickr

A Flickr gallery app for With.

## Design decisions

1. Went with a fairly straightforward Redux approach, using redux-toolkit and async actions, as provided by the community Redux+Typescript CRA template. They're not flashy, but they're practical and easy to understand, which is valuable.
2. Material UI is my baseline component library which I use in most projects. It provides sane defaults, some nice microinteractions, and deep but simple customization.
3. I experimented with several ways to handle the loading of photos into the grid. I initially attempted to animate their appearance in a staggered fashion using framer-motion, but this was simply not performant. Instead I scaled back to a simple pop-in, adding a slight background color to the items so they act as their own loading skeletons while the images are fetched.
4. I also chose to display a loading spinner, but delay its appearance by 2 seconds. Showing a spinner immediately increases the user's perception of loading time. This roughly approximates the principle behind a more robust solution like React Suspense. You can see this behavior if you throttle the network in the devtools.
5. For pagination, I implemented a simple visibility trigger component. When the component comes into view, it triggers the loading of the next page of photos. It's placed at the bottom of the grid. Pretty bog-standard infinite loading.
6. For the grid itself, CSS Grid serves me well. It's easy to make responsive using media queries.

## Things to check out

1. I tried to ensure the app has keyboard accessibility
2. In addition to the basic requirements, I thought a lightbox feature to showcase a particular photo was a useful addition to any 'photo gallery' functionality
3. I took a stab at best practices for loading states, delaying the use of a loading spinner until a certain time has passed. This helps minimize user perception of loading time. You can see the spinner show up if you modify network throttling in the devtools.
4. The app also handles request errors - although in an admittedly very barebones manner. Still, I believe the error experience is a first-class flow which deserves consideration at any scale.

## Where I would go next

If I were developing the app further, I'd look into the stuff below.

1. Virtualizing the grid. This is probably the biggest impact item, especially with the infinite loading. Virtualizing would remove images from the DOM as they move out of view, reducing the load on the browser's rendering as more and more images are loaded from the API. I'd pull in a community library for this, like [react-virtualized](https://bvaughn.github.io/react-virtualized/#/components/List).
2. Testing. In an app of this scale I'd lean heavily on unit tests (using [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)), with maybe one [Cypress](https://cypress.io) browser test for the integration of the whole flow. I'm pretty experienced with these tools, but didn't bring them in for this project as I wanted to focus on the explicit requirements, and I was confident in my ability to implement them using simple manual testing at this scale.
3. Tuning image source sizes responsively. Flickr allows for specifying a source image size. I utilized this to limit the size of the thumbnails to reduce the overhead of loading all the images at once, but on smaller devices it could be even further reduced.
4. Fixing some aspect ratio issues. On certain screen shapes and with certain photo aspect ratios, the lightbox doesn't quite scale the dimensions correctly. Part of the reason this is difficult is that I don't have any access to photo dimension data via the API. I've worked with other APIs where photos include aspect ratio in the payload which makes this far more trivial to implement. If I were working on or with the team implementing the API, I'd suggest adding this feature. Otherwise, there are client-side ways to measure aspect ratio which aren't too bad, just a bit of a pain.
5. Improving the transition from search to results. I think it would be nice to include more animation in this step.
6. Debounced automatic search on type. This is trivial to do, but it wasn't high on my priority list.
7. A better error state that provides actionable next steps for the user - like a button to retry the search.

## Development / Setup

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
