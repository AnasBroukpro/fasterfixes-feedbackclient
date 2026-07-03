import "server-only";

import { createMailer } from "./mailer-factory";
import type { Mailer } from "./types";

let _mailer: Mailer | null = null;

export const mailer: Mailer = new Proxy<Mailer>({} as Mailer, {
  get(_target, prop) {
    if (!_mailer) _mailer = createMailer();
    return Reflect.get(_mailer!, prop);
  },
});

// Re-export types for convenience
export type {
  Contact,
  CreateContactOptions,
  EmailAttachment,
  EmailResponse,
  MailOptions,
  UpdateContactOptions,
} from "./types";

export { EmailError } from "./types";
