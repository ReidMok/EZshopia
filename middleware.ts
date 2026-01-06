// Middleware is NOT supported in "output: 'export'" mode (Static Site Generation).
// Since we are deploying to GitHub Pages (static hosting), we must disable this file.
// The routing logic is currently handled client-side in App.tsx.

// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export const config = {
//   matcher: ["/((?!api/|_next/|_static/|[\\w-]+\\.\\w+).*)"],
// };

// export default async function middleware(req: NextRequest) {
//   return NextResponse.next();
// }