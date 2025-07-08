import { Controller, Get, UseGuards, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { RoleGuardFactory } from '../guard/role-guard.factory';
import { ResponseHelper } from '../common/response.helper';
import { AquaLabGroupGuard } from '../guard/aqua-lab-group.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Aqua Lab Routes')
@ApiBearerAuth()
@Controller('/aqualab')
@UseGuards(AquaLabGroupGuard)
export class AquaLabController {

  @Get('/test')
  async test(@Res() res: Response) {
    console.log("Testing route");
    return ResponseHelper.success(res, 'You have Aqua Lab Module access', HttpStatus.OK);
  }

  @Get('/aqua-lab-system-update')
  @UseGuards(RoleGuardFactory(['aqua-lab-system-update']))
  async protectedRouteUpdate(@Res() res: Response) {
    return ResponseHelper.success(res, 'You have aqua-lab-system-update access in Aqua Lab', HttpStatus.OK);
  }

  @Get('/aqua-lab-system-view')
  @UseGuards(RoleGuardFactory(['aqua-lab-system-view']))
  async protectedRouteView(@Res() res: Response) {
    return ResponseHelper.success(res, 'You have aqua-lab-system-view access Aqua Lab', HttpStatus.OK);
  }

  @Get('/request-update')
  @UseGuards(RoleGuardFactory(['request-update']))
  async protectedRouteRequestUpdate(@Res() res: Response) {
    return ResponseHelper.success(res, 'You have request-update access Aqua Lab', HttpStatus.OK);
  }

  @Get('/request-view')
  @UseGuards(RoleGuardFactory(['request-view']))
  async protectedRouteRequestView(@Res() res: Response) {
    return ResponseHelper.success(res, 'You have request-update access Aqua Lab', HttpStatus.OK);
  }
}
