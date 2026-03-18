import { Model } from 'miragejs';
import { ModelDefinition } from 'miragejs/-types';

export type UserMock = {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export const models = {
  user: Model as ModelDefinition<UserMock>,
};
