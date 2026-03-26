import type { ZodObject, ZodRawShape } from 'zod';

import { ZodError } from 'zod';

// eslint-disable-next-line node/no-process-env
export default function tryParseEnv<T extends ZodRawShape>(EnvSchema: ZodObject<T>, buildEnv: Record<string, string | undefined> = process.env) {
  try {
    EnvSchema.parse(buildEnv);
  }
  catch (error) {
    if (error instanceof ZodError) {
      let message = 'Missing required valuses in .env:\n';
      error.issues.forEach((issue) => {
        message += `${issue.path[0]}\n`;
      });

      const e = new Error(message);
      e.stack = ''; // Clear stack trace for cleaner output
      throw e;
    }
    else {
      console.error(message);
    }
  }
}
