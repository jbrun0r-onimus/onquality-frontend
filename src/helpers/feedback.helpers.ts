import { Notify } from 'quasar';
import { FeedbackDefinition } from 'src/typings/feedback.typings';

export function showFeedback(feedback: FeedbackDefinition) {
  Notify.create({
    message: feedback.message,
    type: feedback.type,
    position: 'top-right',
  });
}

export function showSuccessFeedback(message: string) {
  showFeedback({ message, type: 'positive' });
}

export function showInfoFeedback(message: string) {
  showFeedback({ message, type: 'info' });
}

export function showWarningFeedback(message: string) {
  showFeedback({ message, type: 'warning' });
}

export function showErrorFeedback(message: string) {
  showFeedback({ message, type: 'negative' });
}
