# fluffster

A lightweight state container based on reactive streams.

NOTE: This repository is not maintained/developed in ES6 for the sake of its lightweight nature and compatibility. There will be attempts to converting the code to UMD compatible format in future, however.

Sample use :

```javascript
router.defaultErrorHandler = false;

router.route(
    {
        "/": {
            component: [HomePage],
            appState: {
                test: 1
            }
        }
    });

router.route(
    {
        "/test": {
            component: [TestPage],
            appState: {
                test: 2
            }
        }
    });

router.route(
    {
        "/another/:id": {
            component: [AnotherPage],
            appState: {
                test: 3
            }
        }
    });

router.route(
    {
        "/error": {
            component: [NotFound],
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
            component: [ComponentA, ComponentB],
            id: ["#mount-a", "#mount-b"]
            appState: {
                test: 404
            }
        }
    });
```
