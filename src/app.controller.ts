import { Body, Controller, Get, HttpStatus, Param, Post, Res,} from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { LoginDto, RegisterDto } from './dto';
import { ResponseHelper } from './common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth, } from '@nestjs/swagger';
import { SwaggerAuthDocs, SwaggerResponses } from './docs/swagger.constants';

@ApiTags('Auth & Roles')
@ApiBearerAuth()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('/register')
  @ApiOperation({ summary: SwaggerAuthDocs.register.summary })
  @ApiBody({
    type: RegisterDto,
    examples: {
      example1: {
        summary: 'Register Example',
        value: SwaggerAuthDocs.register.example,
      },
    },
  })
  @ApiResponse(SwaggerResponses.success201)
  @ApiResponse(SwaggerResponses.badRequest400)
  @ApiResponse(SwaggerResponses.conflict409)
  @ApiResponse(SwaggerResponses.internal500)
  async register(@Body() data: RegisterDto, @Res() res: Response) {
    try {
      await this.appService.registerUser(data);
      return ResponseHelper.success(res, 'User Registered!', HttpStatus.CREATED);
    } catch (err) {
      return ResponseHelper.error(res, err);
    }
  }

  @Post('/login')
  @ApiOperation({ summary: SwaggerAuthDocs.login.summary })
  @ApiBody({
    type: LoginDto,
    examples: {
      example1: {
        summary: 'Login Example',
        value: SwaggerAuthDocs.login.example,
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      example: SwaggerAuthDocs.login.responseExample,
    },
  })
  @ApiResponse(SwaggerResponses.unauthorized401)
  @ApiResponse(SwaggerResponses.internal500)
  async login(@Body() data: LoginDto, @Res() res: Response) {
    try {
      const result = await this.appService.loginUser(data);
      return ResponseHelper.success(res, result);
    } catch (err) {
      return ResponseHelper.error(res, err);
    }
  }

  @Post('/roles')
  @ApiOperation({ summary: SwaggerAuthDocs.assignRole.summary })
  @ApiBody({
    schema: {
      example: SwaggerAuthDocs.assignRole.example
    },
  })
  @ApiResponse(SwaggerResponses.success200)
  @ApiResponse(SwaggerResponses.notFound404)
  @ApiResponse(SwaggerResponses.internal500)
  async assignRole(
    @Body() data: { userId: string; roles: string[] },
    @Res() res: Response,
  ) {
    try {
      const { userId, roles } = data;
      await this.appService.assignRolesToUser(userId, roles);
      return ResponseHelper.success(res, `Roles assigned to user with ${roles}`);
    } catch (err) {
      return ResponseHelper.error(res, err);
    }
  }

  @Post('/roles/unassign')
  @ApiOperation({ summary: SwaggerAuthDocs.unassignRole.summary })
  @ApiBody({
    schema: {
      example: SwaggerAuthDocs.unassignRole.example,
    },
  })
  @ApiResponse(SwaggerResponses.success200)
  @ApiResponse(SwaggerResponses.notFound404)
  @ApiResponse(SwaggerResponses.internal500)
  async unassignRoles(
    @Body() data: { userId: string; roles: string[] },
    @Res() res: Response,
  ) {
    try {
      const { userId, roles } = data;
      await this.appService.unassignRolesFromUser(userId, roles);
      return ResponseHelper.success(res, `Roles unassigned from user: ${roles.join(', ')}`);
    } catch (err) {
      return ResponseHelper.error(res, err);
    }
  }

  @Get('/:userId')
  @ApiOperation({ summary: SwaggerAuthDocs.getRoles.summary })
  @ApiParam({ name: 'userId', required: true, type: String })
  @ApiResponse({
    status: 200,
    description: 'User found',
    schema: {
      example: SwaggerAuthDocs.getRoles.responseExample,
    },
  })
  @ApiResponse(SwaggerResponses.notFound404)
  @ApiResponse(SwaggerResponses.internal500)
  async getUser(@Param('userId') userId: string, @Res() res: Response) {
    try {
      const user = await this.appService.getUser(userId);
      return ResponseHelper.success(res, user);
    } catch (err) {
      return ResponseHelper.error(res, err);
    }
  }

  @Get('/roles/:userId')
  @ApiOperation({ summary: SwaggerAuthDocs.getRoles.summary })
  @ApiParam({ name: 'userId', required: true, type: String })
  @ApiResponse({
    status: 200,
    description: 'List of roles',
    schema: {
      example: SwaggerAuthDocs.getRoles.responseExample,
    }
  })
  @ApiResponse(SwaggerResponses.notFound404)
  @ApiResponse(SwaggerResponses.internal500)
  async getRoles(@Param('userId') userId: string, @Res() res: Response) {
    try {
      const roles = await this.appService.getUserRoles(userId);
      return ResponseHelper.success(res, roles);
    } catch (err) {
      return ResponseHelper.error(res, err);
    }
  }
}
