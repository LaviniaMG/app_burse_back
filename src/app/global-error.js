'use client';

import Error500 from '../views/maintenance/500';

// ==============================|| ERROR 500 - MAIN ||============================== //

export default function GlobalError({}) {
  return (
    <html lang="en">
      <body>
        <Error500 />
      </body>
    </html>
  );
}
