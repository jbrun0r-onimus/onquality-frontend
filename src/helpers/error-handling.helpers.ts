import { AxiosError } from 'axios';
import { globalI18n } from 'src/boot/i18n';
import { showFeedback } from 'src/helpers/feedback.helpers';
import type { FeedbackDefinition } from 'src/typings/feedback.typings';
import { ValidationError } from 'yup';

export function getMessageFromAxiosError(error: AxiosError): string {
  const body = error.response?.data;

  if (
    body instanceof Object &&
    'userMessage' in body &&
    typeof body.userMessage === 'string'
  )
    return body.userMessage;

  return globalI18n.t('common.feedback.serverErrorWithMessage', {
    message: error.message,
  });
}

function formatPath(input: string): string {
  return input
    .replace(/\./g, ' > ') // Replace dots with arrows
    .replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()) // Convert snake_case to camelCase
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase words
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
}

export function getFeedbackFromValidationError(
  error: ValidationError
): FeedbackDefinition[] {
  if (error.inner.length)
    return error.inner.map(getFeedbackFromValidationError).flat();

  return [
    {
      message: error.path
        ? `${formatPath(error.path)}: ${error.message}`
        : error.message,
      type: 'warning',
    },
  ];
}

export function getFeedbackFromError(error: unknown): FeedbackDefinition[] {
  if (error instanceof AxiosError && error.config?.meta?.notify === false)
    return [];

  if (error instanceof ValidationError) {
    return getFeedbackFromValidationError(error);
  }

  return [
    {
      message: getMessageFromUnknownError(error),
      type: 'negative',
    },
  ];
}

export function getMessageFromUnknownError(error: unknown): string {
  if (error instanceof AxiosError) return getMessageFromAxiosError(error);

  if (
    error instanceof Object &&
    'message' in error &&
    typeof error.message === 'string'
  )
    return globalI18n.t('common.feedback.errorWithMessage', {
      message: error.message,
    });

  if (typeof error === 'string')
    return globalI18n.t('common.feedback.errorWithMessage', { message: error });

  return globalI18n.t('common.feedback.unknownError');
}

export function appHandleError(error: unknown) {
  console.error(error);
  const feedback = getFeedbackFromError(error);
  feedback.forEach(showFeedback);
}
