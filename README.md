# fluffster

A lightweight state container based on reactive streams.

Sample use :

```
router.defaultErrorHandler = false;

router.route(
    {
        "/": {
            /* @view */
            component: [HomePage],
            /* @model */
            appState: {
                test: 1
            }
        }
    });

router.route(
    {
        "/test": {
            /* @view */
            component: [TestPage],
            /* @model */
            appState: {
                test: 2
            }
        }
    });

router.route(
    {
        "/another/:id": {
            /* @view */
            component: [AnotherPage],
            /* @model */
            appState: {
                test: 3
            }
        }
    });

router.route(
    {
        "/error": {
            /* @view */
            component: [NotFound],
            /* @model */
            appState: {
                test: 404
            }
        }
    });

router.listen();
```

# usage with React 

If you want to use it with React, please prepend the code with:

```
router.driver('react');
```

It will allow fluffster to work with JSX-style rendering if needed. All appState props will then be availible in the JSX components in ```props```.

Additionally you'd have to provide additional mountpoint for each component:

```
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
