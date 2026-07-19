import { toast } from 'sonner';

import { formatLogValue, Logger, LogScope } from '../services/logger';
import { errorMessage } from './error';

const TOAST_MAX_LENGTH = 100;

const truncateForToast = (message: string): string => {
  if (message.length > TOAST_MAX_LENGTH) {
    return `${message.slice(0, TOAST_MAX_LENGTH)}...`;
  }
  return message;
};

type ReportErrorOptions = {
  userMessage: string;
  error: unknown;
};

export const reportError = async (
  scope: LogScope,
  { userMessage, error }: ReportErrorOptions,
): Promise<void> => {
  const fullLogMessage = `${userMessage}: ${formatLogValue(error)}`;

  await Logger[scope].error(fullLogMessage);

  toast.error(userMessage, {
    description: truncateForToast(errorMessage(error)),
  });
};
