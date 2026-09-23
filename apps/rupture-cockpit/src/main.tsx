import * as ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router';

import { router } from './app/router';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

// StrictMode is intentionally omitted.
//
// React Three Fiber v9 (required for React 19) now inherits StrictMode from
// the parent renderer. React 19 StrictMode double-invokes effects in
// development; R3F creates the WebGL context inside an effect, so the
// double-invocation destroys and recreates the context and the canvas is
// reported as "Context Lost" on first mount. The lazy-loaded 3D view makes
// the timing worse because the Canvas mounts after a Suspense suspension,
// which leaves the context unrecoverable.
//
// StrictMode can be restored once R3F ships a fix for this interaction.
// See the B6 issue's "Limitations recorded" section.
root.render(<RouterProvider router={router} />);
