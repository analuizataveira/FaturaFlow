import { subYears } from 'date-fns';

export const ONE_MINUTE_IN_SECONDS = 60;
export const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;
export const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
export const ONE_HOUR_IN_SECONDS = 60 * 60;

export const prismaTxOptions = {
  maxWait: 100000,
  timeout: 100000,
};

export const headersDictionary = {
  accessToken: 'leadpay_access_token_v1',
  refreshToken: 'leadpay_refresh_token_v1',
};

export const defaultDate = new Date('2021-01-01T00:00:00.000Z');

export const defaultBirthDate = subYears(defaultDate, 20);
