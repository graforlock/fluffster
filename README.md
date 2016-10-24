# fluffster

A lightweight state container based on reactive streams.

NOTE: This repository is not maintained/developed in ES6 for the sake of its lightweight nature and compatibility. There will be attempts to converting the code to UMD compatible format in future, however.

Sample use :

```javascript
router.defaultErrorHandler = false;

router.appState(
  {
       /* @Global Model */
       auth: false,
       userDetails: {
           username: "",
           email: ""
       },
       update: {
           
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

Additionally you'd have to provide additional mountpoint for each component:

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
