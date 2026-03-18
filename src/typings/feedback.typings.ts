export type FeedbackType = 'positive' | 'info' | 'warning' | 'negative';

export type FeedbackDefinition = {
  message: string;
  type: FeedbackType;
};
