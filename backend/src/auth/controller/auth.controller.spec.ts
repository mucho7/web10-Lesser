import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../service/auth.service';
import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { MemberService } from 'src/member/service/member.service';

describe('Auth Controller Unit Test', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            getGithubAuthUrl: jest.fn(),
            githubAuthentication: jest.fn(),
            githubSignup: jest.fn(),
            logout: jest.fn(),
            refreshAccessTokenAndRefreshToken: jest.fn(),
            getGithubUsernameByTempIdToken: jest.fn(),
          },
        },
        {
          provide: MemberService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('Github Signup', () => {
    const mockResponse = {
      cookie: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    } as unknown as Response;
    const mockBody = {
      username: 'username',
      position: 'position',
      techStack: ['javascript', 'typescript'],
    };

    interface CustomHeaders {
      authorization: string;
    }

    it('should throw UnauthorizedException if authorization header is missing', () => {
      const mockRequest = {
        headers: {},
      } as Request & { headers: CustomHeaders };

      expect(
        async () =>
          await controller.githubSignup(mockRequest, mockBody, mockResponse),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if authorization header format is invalid', () => {
      const mockRequest = {
        headers: {
          authorization: 'InvalidFormat',
        },
      } as Request & { headers: CustomHeaders };

      expect(
        async () =>
          await controller.githubSignup(mockRequest, mockBody, mockResponse),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should pass if authorization header is in Bearer format', async () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer validToken',
        },
      } as Request & { headers: CustomHeaders };
      jest.spyOn(authService, 'githubSignup').mockResolvedValue({
        accessToken: 'access token',
        refreshToken: 'refresh token',
      });

      await controller.githubSignup(mockRequest, mockBody, mockResponse);

      expect(authService.githubSignup).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.send).toHaveBeenCalledWith({
        accessToken: 'access token',
      });
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'refresh token',
        {
          httpOnly: true,
          secure: true,
          path: '/api/auth/',
          sameSite: 'strict',
        },
      );
    });

    it('should throw 401 error when githubSignup service throws "Failed to verify token"', async () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer expiredToken',
        },
      } as Request & { headers: CustomHeaders };
      jest
        .spyOn(authService, 'githubSignup')
        .mockRejectedValue(new Error('Failed to verify token'));

      expect(
        async () =>
          await controller.githubSignup(mockRequest, mockBody, mockResponse),
      ).rejects.toThrow(new UnauthorizedException('Expired:tempIdToken'));
    });

    it('should throw 401 error when githubSignup service throws "tempIdToken does not match"', async () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer expiredToken',
        },
      } as Request & { headers: CustomHeaders };
      jest
        .spyOn(authService, 'githubSignup')
        .mockRejectedValue(new Error('tempIdToken does not match'));

      expect(
        async () =>
          await controller.githubSignup(mockRequest, mockBody, mockResponse),
      ).rejects.toThrow(new UnauthorizedException('Expired:tempIdToken'));
    });

    it('should return 500 response when githubSignup service throws unknown error', async () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer validToken',
        },
      } as Request & { headers: CustomHeaders };
      jest.spyOn(authService, 'githubSignup').mockRejectedValue(new Error());

      expect(
        async () =>
          await controller.githubSignup(mockRequest, mockBody, mockResponse),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('Logout', () => {
    interface CustomHeaders {
      authorization: string;
    }
    const mockResponse = {
      clearCookie: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    } as unknown as Response;
    it('should return 200', async () => {
      const accessToken = 'accessToken';
      const mockRequest = {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      } as Request & { headers: CustomHeaders };

      await controller.logout(mockRequest, mockResponse);

      expect(authService.logout).toHaveBeenCalledWith(accessToken);
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('refreshToken', {
        httpOnly: true,
        secure: true,
        path: '/api/auth/',
        sameSite: 'strict',
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should throw 401 error when logout service throws "Not a logged in member', async () => {
      const accessToken = 'accessToken';
      const mockRequest = {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      } as Request & { headers: CustomHeaders };
      jest
        .spyOn(authService, 'logout')
        .mockRejectedValue(new Error('Not a logged in member'));

      expect(
        async () => await controller.logout(mockRequest, mockResponse),
      ).rejects.toThrow(new UnauthorizedException('Not a logged in member'));
    });

    it('should throw 401 error when logout service throws "Failed to verify token', async () => {
      const accessToken = 'accessToken';
      const mockRequest = {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      } as Request & { headers: CustomHeaders };
      jest
        .spyOn(authService, 'logout')
        .mockRejectedValue(new Error('Failed to verify token'));

      expect(
        async () => await controller.logout(mockRequest, mockResponse),
      ).rejects.toThrow(new UnauthorizedException('Expired:accessToken'));
    });

    it('should throw 500 error when logout service throws unknown error', async () => {
      const accessToken = 'accessToken';
      const mockRequest = {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      } as Request & { headers: CustomHeaders };
      jest.spyOn(authService, 'logout').mockRejectedValue(new Error());

      expect(
        async () => await controller.logout(mockRequest, mockResponse),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('Refresh', () => {
    const mockResponse = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
    } as unknown as Response;

    it('should return 201', async () => {
      const requestRefreshToken = 'refreshToken';
      const newAccessToken = 'newAccessToken';
      const newRefreshToken = 'newRefreshToken';
      const mockRequest = {
        cookies: {
          refreshToken: requestRefreshToken,
        },
      } as Request;
      jest
        .spyOn(authService, 'refreshAccessTokenAndRefreshToken')
        .mockResolvedValue({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });

      await controller.refresh(mockRequest, mockResponse);

      expect(
        authService.refreshAccessTokenAndRefreshToken,
      ).toHaveBeenCalledWith(requestRefreshToken);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.send).toHaveBeenCalledWith({
        accessToken: newAccessToken,
      });
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refreshToken',
        newRefreshToken,
        {
          httpOnly: true,
          secure: true,
          path: '/api/auth/',
          sameSite: 'strict',
        },
      );
    });

    it('should throw 401 error when refresh service throws "No matching refresh token"', async () => {
      const requestRefreshToken = 'refreshToken';
      const mockRequest = {
        cookies: {
          refreshToken: requestRefreshToken,
        },
      } as Request;
      jest
        .spyOn(authService, 'refreshAccessTokenAndRefreshToken')
        .mockRejectedValue(new Error('No matching refresh token'));

      expect(
        async () => await controller.refresh(mockRequest, mockResponse),
      ).rejects.toThrow(new UnauthorizedException('Expired:refreshToken'));
    });

    it('should throw 401 error when refresh service throws "Failed to verify token"', async () => {
      const requestRefreshToken = 'refreshToken';
      const mockRequest = {
        cookies: {
          refreshToken: requestRefreshToken,
        },
      } as Request;
      jest
        .spyOn(authService, 'refreshAccessTokenAndRefreshToken')
        .mockRejectedValue(new Error('Failed to verify token'));

      expect(
        async () => await controller.refresh(mockRequest, mockResponse),
      ).rejects.toThrow(new UnauthorizedException('Expired:refreshToken'));
    });

    it('should throw 500 error when refresh service throws unknown error', async () => {
      const requestRefreshToken = 'refreshToken';
      const mockRequest = {
        cookies: {
          refreshToken: requestRefreshToken,
        },
      } as Request;
      jest
        .spyOn(authService, 'refreshAccessTokenAndRefreshToken')
        .mockRejectedValue(new Error());

      expect(
        async () => await controller.refresh(mockRequest, mockResponse),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('Get github username', () => {
    interface CustomHeaders {
      authorization: string;
    }
    it('should return github username when given valid temp id token', async () => {
      const tempIdToken = 'tempIdToken';
      const githubUsername = 'githubUsername';
      const mockRequest = {
        headers: {
          authorization: `Bearer ${tempIdToken}`,
        },
      } as Request & { headers: CustomHeaders };
      jest
        .spyOn(authService, 'getGithubUsernameByTempIdToken')
        .mockResolvedValue(githubUsername);

      const response = await controller.getGithubUsername(mockRequest);

      expect(authService.getGithubUsernameByTempIdToken).toHaveBeenCalledWith(
        tempIdToken,
      );
      expect(response.githubUsername).toBe(githubUsername);
    });

    it('should throw 401 if authorization header is missing', () => {
      const mockRequest = {
        headers: {},
      } as Request & { headers: CustomHeaders };

      expect(
        async () => await controller.getGithubUsername(mockRequest),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw 401 if authorization header format is invalid', () => {
      const mockRequest = {
        headers: {
          authorization: 'InvalidFormat',
        },
      } as Request & { headers: CustomHeaders };

      expect(
        async () => await controller.getGithubUsername(mockRequest),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw 401 when get github username service throws "Failed to verify token', async () => {
      const tempIdToken = 'tempIdToken';
      const mockRequest = {
        headers: {
          authorization: `Bearer ${tempIdToken}`,
        },
      } as Request & { headers: CustomHeaders };
      jest
        .spyOn(authService, 'getGithubUsernameByTempIdToken')
        .mockRejectedValue(new Error('Failed to verify token'));

      expect(
        async () => await controller.getGithubUsername(mockRequest),
      ).rejects.toThrow(new UnauthorizedException('Expired:tempIdToken'));
    });

    it('should throw 401 when github username service throws "tempIdToken does not match"', async () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer expiredToken',
        },
      } as Request & { headers: CustomHeaders };
      jest
        .spyOn(authService, 'getGithubUsernameByTempIdToken')
        .mockRejectedValue(new Error('tempIdToken does not match'));

      expect(
        async () => await controller.getGithubUsername(mockRequest),
      ).rejects.toThrow(new UnauthorizedException('Expired:tempIdToken'));
    });

    it('should return 500 response when github username service throws unknown error', async () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer validToken',
        },
      } as Request & { headers: CustomHeaders };
      jest
        .spyOn(authService, 'getGithubUsernameByTempIdToken')
        .mockRejectedValue(new Error());

      expect(
        async () => await controller.getGithubUsername(mockRequest),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
