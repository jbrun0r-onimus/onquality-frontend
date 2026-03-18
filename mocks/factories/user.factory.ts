import faker from 'mocks/faker';
import { Factory } from 'miragejs';
import { UserMock } from 'mocks/models';

function getNames(factoryContext: { name: string | ((n: number) => string) }): {
  firstName: string;
  lastName: string;
} {
  const [firstName, lastName] = (factoryContext.name as string).split(' ');
  return { firstName, lastName };
}

export const userFactory = Factory.extend<UserMock>({
  id() {
    return faker.string.uuid();
  },

  name() {
    return `${faker.person.firstName()} ${faker.person.lastName()}`;
  },

  username() {
    return faker.internet.userName(getNames(this));
  },

  email() {
    return faker.internet.email(getNames(this));
  },

  password() {
    return faker.internet.password();
  },

  createdAt() {
    return faker.date.past();
  },

  updatedAt() {
    return faker.date.recent();
  },
});
