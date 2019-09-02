import { Store, createStore, compose, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
// import logger from 'redux-logger';
import { state } from './index';

// Redux-Persist.
// Enables our store to persist even after refreshes.
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';
const persistConfig = {
    key: 'root',
    storage: storage,
    stateReconciler: autoMergeLevel2, // see "Merge Process" section for details.
    blacklist: ['ui']
};
const pReducer = persistReducer(persistConfig, state);

// Standard redux
const a: any = window;
const composeEnhancers = a.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhancer = composeEnhancers(
    // There are much better ways to see redux logs,
    // like browser extensions.
    // applyMiddleware(reduxThunk, logger),
    applyMiddleware(reduxThunk),
    // other store enhancers if any
);

export const store: Store<any> = createStore(
    // state,
    pReducer,
    enhancer
);

export const persistor = persistStore(store);
// persistor.purge();
