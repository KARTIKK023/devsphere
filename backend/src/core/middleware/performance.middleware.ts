// import { performance } from "node:perf_hooks";

// app.use((req, res, next) => {
//   const start = performance.now();

//   res.on("finish", () => {
//     if (req.path === "/auth/me") {
//       console.log({
//         method: req.method,
//         path: req.path,
//         status: res.statusCode,
//         durationMs: Math.round(
//           performance.now() - start
//         ),
//       });
//     }
//   });

//   next();
// });

