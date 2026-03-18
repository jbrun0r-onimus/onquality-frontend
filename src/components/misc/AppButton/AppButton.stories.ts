import type { Meta, StoryFn } from '@storybook/vue3';

import AppButton from './AppButton.vue';

export default {
  title: 'AppButton',
  tags: ['autodocs', 'button'],
  component: AppButton,
  argTypes: {
    color: {
      options: [
        'primary',
        'secondary',
        'accent',
        'dark',
        'positive',
        'negative',
        'info',
        'warning',
      ],
      defaultValue: 'primary',
    },
  },
} satisfies Meta<typeof AppButton>;

export const Default: StoryFn<typeof AppButton> = () => ({
  components: { AppButton },
  template: '<AppButton>Label</AppButton>',
});

export const Outline: StoryFn<typeof AppButton> = () => ({
  components: { AppButton },
  template: '<AppButton outline>Label</AppButton>',
});
