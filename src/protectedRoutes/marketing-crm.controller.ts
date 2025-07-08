import { Controller, Get, UseGuards, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { RoleGuardFactory } from '../guard/role-guard.factory';
import { ResponseHelper } from '../common/response.helper';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MarketingCrmGroupGuard } from 'src/guard/marketing-crm-group.guard';

@ApiTags('Marketing Routes')
@ApiBearerAuth()
@Controller('/marketing')
@UseGuards(MarketingCrmGroupGuard)
export class MarketingController {

  @Get('/test')
  async test(@Res() res: Response) {
    return ResponseHelper.success(res, 'You have Marketing & CRM access ', HttpStatus.OK);
  }

  @Get('/campaign-create')
  @UseGuards(RoleGuardFactory(['campaign-create']))
  async protectedRouteCampaignCreate(@Res() res: Response) {
    return ResponseHelper.success(res, 'You have campaign-create access in Marketing & CRM', HttpStatus.OK);
  }

  @Get('/campaign-view')
  @UseGuards(RoleGuardFactory(['campaign-view']))
  async protectedRouteCampaignView(@Res() res: Response) {
    return ResponseHelper.success(res, 'You have campaign-view access in Marketing & CRM', HttpStatus.OK);
  }

  @Get('/checkout-forms-update')
  @UseGuards(RoleGuardFactory(['checkout-forms-update']))
  async protectedRouteCheckoutUpdate(@Res() res: Response) {
    return ResponseHelper.success(res, 'You have checkout-forms-update access in Marketing & CRM', HttpStatus.OK);
  }

  @Get('/checkout-forms-view')
  @UseGuards(RoleGuardFactory(['checkout-forms-view']))
  async protectedRouteCheckoutView(@Res() res: Response) {
    return ResponseHelper.success(res, 'You have checkout-forms-view access in Marketing & CRM', HttpStatus.OK);
  }
}
