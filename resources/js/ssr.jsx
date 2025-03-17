/* prettier-ignore */
import {
    createInertiaApp
} from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import ReactDOMServer from 'react-dom/server';
import { route } from "ziggy-js";
import { Ziggy } from '@/ziggy'

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        resolve: (name) => {
            const pages = import.meta.glob('./pages/**/*.tsx', {
                eager: true,
            });
            return pages[`./pages/${name}.tsx`];
        },
        // prettier-ignore
        setup: ({ App, props }) => {

            global.route = (name, params, absolute, config = Ziggy) => route(name, params, absolute, config);

            return <App {...props} />
        }
    }),
);
