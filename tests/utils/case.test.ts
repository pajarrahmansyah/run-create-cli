import {
  describe,
  expect,
  it,
} from 'vitest';

import { toCases } from '@/utils/case';

describe('toCases', () => {
  it('should convert simple string to all cases', () => {
    const result = toCases('user auth');

    expect(result).toEqual({
      raw: 'user auth',
      pascal: 'UserAuth',
      camel: 'userAuth',
      kebab: 'user-auth',
      snake: 'user_auth',
    });
  });

  it('should handle camelCase input', () => {
    const result = toCases('userAuth');

    expect(result).toEqual({
      raw: 'userAuth',
      pascal: 'UserAuth',
      camel: 'userAuth',
      kebab: 'user-auth',
      snake: 'user_auth',
    });
  });

  it('should handle PascalCase input', () => {
    const result = toCases('UserAuth');

    expect(result).toEqual({
      raw: 'UserAuth',
      pascal: 'UserAuth',
      camel: 'userAuth',
      kebab: 'user-auth',
      snake: 'user_auth',
    });
  });

  it('should handle kebab-case input', () => {
    const result = toCases('user-auth');

    expect(result).toEqual({
      raw: 'user-auth',
      pascal: 'UserAuth',
      camel: 'userAuth',
      kebab: 'user-auth',
      snake: 'user_auth',
    });
  });

  it('should handle snake_case input', () => {
    const result = toCases('user_auth');

    expect(result).toEqual({
      raw: 'user_auth',
      pascal: 'UserAuth',
      camel: 'userAuth',
      kebab: 'user-auth',
      snake: 'user_auth',
    });
  });

  it('should handle mixed formats', () => {
    const result = toCases('user-auth_module');

    expect(result).toEqual({
      raw: 'user-auth_module',
      pascal: 'UserAuthModule',
      camel: 'userAuthModule',
      kebab: 'user-auth-module',
      snake: 'user_auth_module',
    });
  });

  it('should handle single word', () => {
    const result = toCases('user');

    expect(result).toEqual({
      raw: 'user',
      pascal: 'User',
      camel: 'user',
      kebab: 'user',
      snake: 'user',
    });
  });

  it('should handle numbers', () => {
    const result = toCases('api2Client');

    expect(result).toEqual({
      raw: 'api2Client',
      pascal: 'Api2Client',
      camel: 'api2Client',
      kebab: 'api2-client',
      snake: 'api2_client',
    });
  });
});
