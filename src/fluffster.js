import ReactDOM from 'react-dom';
import React from 'react';
import kefir from 'kefir';
import {compareTo, extend, extendMany, each} from './utils';

class State {
    constructor(config)
    {
        this.state = config.appState;
        this._stream$ = kefir.pool();
        this.initState = config.appState;
        this.callbacks = [];

        /* @Default */
        this.onChange((state) =>
        {
            /* A Basic required subscriber. Utilizes a reactive stream
             to push data forward. */

            this._stream$.plug(kefir.stream((emitter) => emitter.emit(state)));
        });
        /* The first push is .notify(), otherwise the component
         would not be capable of initial render at all. */

        this.notify();
        this.provideVtree(config);
    }

    /* @Bound */
    updateState(newState)
    {
        let comparator = extendMany({}, this.state, newState);
        if (!compareTo(this.state, comparator))
        /* If state differs... then */
        {
            extend(this.state, newState);
            this.notify(this.state);
        }
    };

    notify(newState = this.state)
    {
        /* Pushes updates to the app. */

        for (var i = 0; i < this.callbacks.length; i++)
        {
            this.callbacks[i](newState);
        }
    }

    onChange(callback)
    {
        /* Subscribers are actually what executes on .notify().
         They are functions, not nodes/objects. */

        this.callbacks.push(callback);
    }

    stream()
    {
        /* This is a getter that returns a stream that components
         subscribe to, so example subscribe method should look like:
         (...)
         subscribe(stream)
         {
         stream.onValue(callback)
         }
         (...)
         */

        return this._stream$;
    }

    resetState()
    {
        this.updateState(this.initState);
    }

    provide({component})
    {
        each(component, (Component, _) =>
        {
            if (Component && Component.subscribe)
            {
                /* Remember that:
                 every component needs to implement .subscribe() method. */

                Component.subscribe(this.stream());
            }
        })
    }

    provideVtree({component, id})
    {
        this.stream().onValue((appState) =>
        {
            /* Reactive Stream redraws component in a stateless
             fashion with new components. */

            each(component, (Component, index) =>
            {
                ReactDOM.render(<Component {...appState} />, document.querySelector(id[index]));
            });
        });
    }
}


export default State;