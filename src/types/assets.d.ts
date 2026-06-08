// Static asset module declarations (*.png, *.svg, …).
// Mirrors next-env.d.ts, which is gitignored and absent in CI (no `next build`
// runs there) — committing this keeps `tsc` green for image imports.
/// <reference types="next/image-types/global" />
