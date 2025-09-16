// /* eslint-disable @typescript-eslint/no-unused-vars */
// import type { Router } from "@nextplate/api/routes";

// import { hc } from "hono/client";

// // create instance to inline type in build
// // https://hono.dev/docs/guides/rpc#compile-your-code-before-using-it-recommended
// const client = hc<Router>("", {
//   fetch: ((input, init) => {
//     return fetch(input, {
//       ...init,
//       credentials: "include" // Required for sending cookies cross-origin
//     });
//   }) satisfies typeof fetch
// });

// export type Client = typeof client;

// export default (...args: Parameters<typeof hc>): Client => hc<Router>(...args);

// export type ErrorSchema = {
//   error: {
//     issues: {
//       code: string;
//       path: (string | number)[];
//       message?: string | undefined;
//     }[];
//     name: string;
//   };
//   success: boolean;
// };

import { Router } from "@api/routes";
import { hc } from "hono/client";

// create instance to inline type in build
// https://hono.dev/docs/guides/rpc#compile-your-code-before-using-it-recommended
const client = hc<Router>("", {
  fetch: (input: RequestInfo | URL, init?: RequestInit) => {
    return fetch(input, {
      ...init,
      credentials: "include", // Required for sending cookies cross-origin
    });
  },
});

export type Client = typeof client;

export default (...args: Parameters<typeof hc>): Client => hc(...args);

export type ErrorSchema = {
  error: {
    issues: {
      code: string;
      path: (string | number)[];
      message?: string | undefined;
    }[];
    name: string;
  };
  success: boolean;
};
