# fluffster 
[![bitHound Overall Score](https://www.bithound.io/github/graforlock/fluffster/badges/score.svg)](https://www.bithound.io/github/graforlock/fluffster) [![bitHound Code](https://www.bithound.io/github/graforlock/fluffster/badges/code.svg)](https://www.bithound.io/github/graforlock/fluffster) [![bitHound Dependencies](https://www.bithound.io/github/graforlock/fluffster/badges/dependencies.svg)](https://www.bithound.io/github/graforlock/fluffster/master/dependencies/npm) [![bitHound Dev Dependencies](https://www.bithound.io/github/graforlock/fluffster/badges/devDependencies.svg)](https://www.bithound.io/github/graforlock/fluffster/master/dependencies/npm)

A lightweight state container based on reactive streams.

NOTE: This repository is not maintained/developed in ES6 for the sake of its lightweight nature and compatibility. There will be attempts to converting the code to UMD compatible format in future, however.

Run an example:

```javascript
npm run example
```

It Runs on http://localhost:3333.

Sample use :

```javascript

var router = require('fluffster').router,

/* ... Component imports ... */

router.defaultErrorHandler = false;

router.global(
  {
       /* @Global Model */
       auth: false,
       userDetails: {
           username: "",
           email: ""
       }
  });

router.route(
    {
        "/": {
            /* @View */
            component: [HomePage],
            /* @Model */
            appState: {
                test: 1
            },
            /* @Messages */
            messages: {
                 identity: function(appState)
                 {
                       return appState;
                 }
            }
        }
    });

router.route(
    {
        "/test": {
            /* @View */
            component: [TestPage],
            /* @Model */
            appState: {
                test: 2
            }
        }
    });

router.route(
    {
        "/another/:id": {
            /* @View */
            component: [AnotherPage],
            /* @Model */
            appState: {
                test: 3
            }
        }
    });

router.route(
    {
        "/error": {
            /* @View */
            component: [NotFound],
            /* @Model */
            appState: {
                test: 404
            }
        }
    });

router.listen();
```

# usage with React 

If you want to use it with React, please prepend the code with:

```javascript
router.driver('react');
```

It will allow fluffster to work with JSX-style rendering if needed. All appState props will then be availible in the JSX components in ```props```.

Additionally you'd have to provide additional mountpoint for each component, as Router IS NOT a component itself (therefore, its more flexible):

```javascript
router.route(
    {
        "/": {
            /* @View */
            component: [ComponentA, ComponentB],
            /* @Id */
            id: ["#mount-a", "#mount-b"],
            /* @Model */
            appState: {
                test: 404
            }
        }
    });
```
