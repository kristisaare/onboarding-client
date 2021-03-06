const mockHttp = jest.genMockFromModule('../common/http');
jest.mock('../common/http', () => mockHttp);

const { api } = require('.'); // need to use require because of jest mocks being weird

describe('api', () => {
  beforeEach(() => {
    mockHttp.get = jest.fn();
    mockHttp.post = jest.fn();
  });

  it('can authenticate with a phone number', () => {
    const phoneNumber = '1234567';
    const controlCode = '123123123';
    mockHttp.post.mockImplementationOnce(() => Promise.resolve({
      mobileIdChallengeCode: controlCode,
    }));
    expect(mockHttp.post).not.toHaveBeenCalled();
    return api
      .authenticateWithPhoneNumber(phoneNumber)
      .then((givenControlCode) => {
        expect(givenControlCode).toBe(controlCode);
        expect(mockHttp.post).toHaveBeenCalledTimes(1);
        expect(mockHttp.post).toHaveBeenCalledWith('/authenticate', { phoneNumber });
      });
  });

  it('can get a token', () => {
    mockHttp.postForm = jest.fn(() => Promise.resolve({ access_token: 'token' }));
    expect(mockHttp.postForm).not.toHaveBeenCalled();
    return api
      .getToken()
      .then((token) => {
        expect(token).toBe('token');
        expect(mockHttp.postForm).toHaveBeenCalledTimes(1);
        expect(mockHttp.postForm).toHaveBeenCalledWith('/oauth/token', {
          client_id: 'onboarding-client',
          grant_type: 'mobile_id',
        }, { Authorization: 'Basic b25ib2FyZGluZy1jbGllbnQ6b25ib2FyZGluZy1jbGllbnQ=' });
      });
  });

  it('throws in getting token if authentication is finished but errored', () => {
    const error = { error: 'oh no!' };
    mockHttp.postForm = jest.fn(() => Promise.reject(error));
    return api
      .getToken()
      .then(() => expect(0).toBe(1)) // fail, should not go to then.
      .catch(givenError => expect(givenError).toEqual(error));
  });

  it('gives no token in authentication check if error is auth not completed', () => {
    mockHttp.postForm = jest.fn(() => Promise.reject({ error: 'AUTHENTICATION_NOT_COMPLETE' }));
    return api
      .getToken()
      .then(token => expect(token).toBeFalsy());
  });

  it('can get a user with a token', () => {
    const user = { iAmAUser: true };
    const token = 'token';
    mockHttp.get = jest.fn(() => Promise.resolve(user));
    return api
      .getUserWithToken(token)
      .then((givenUser) => {
        expect(givenUser).toEqual(user);
        expect(mockHttp.get).toHaveBeenCalledWith('/v1/me', undefined, {
          Authorization: `Bearer ${token}`,
        });
      });
  });

  it('can get existing funds with a token', () => {
    const pensionFunds = [{ iAmAFund: true }];
    const token = 'token';
    mockHttp.get = jest.fn(() => Promise.resolve(pensionFunds));
    return api
      .getSourceFundsWithToken(token)
      .then((givenPensionFunds) => {
        expect(givenPensionFunds).toEqual(pensionFunds);
        expect(mockHttp.get).toHaveBeenCalledWith('/v1/pension-account-statement', undefined, {
          Authorization: `Bearer ${token}`,
        });
      });
  });

  it('can get target funds with a token', () => {
    const targetFunds = [{ iAmAFund: true }];
    const token = 'token';
    mockHttp.get = jest.fn(() => Promise.resolve(targetFunds));
    return api
      .getTargetFundsWithToken(token)
      .then((givenTarget) => {
        expect(givenTarget).toEqual(targetFunds);
        expect(mockHttp.get).toHaveBeenCalledWith('/v1/available-funds', undefined, {
          Authorization: `Bearer ${token}`,
        });
      });
  });
});
