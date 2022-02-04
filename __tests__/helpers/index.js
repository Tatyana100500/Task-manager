// @ts-check

import fs from 'fs';
import path from 'path';

const getFixturePath = (filename) => path.join(__dirname, '..', '..', '__fixtures__', filename);
const readFixture = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8').trim();
const getFixtureData = (filename) => JSON.parse(readFixture(filename));

export const getTestData = () => getFixtureData('testData.json');

export const prepareData = async (app, user) => {
  const response = await app.inject({
    method: 'POST',
    url: '/login',
    payload: {
      email: user.email,
      password: user.password,
    },
  });
  const [sessionCookies] = response.cookies;
  return { session: sessionCookies.value };
};
