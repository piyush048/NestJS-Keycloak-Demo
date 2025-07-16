import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as qs from 'qs';
import { LoginDto } from './dto/LoginDto';
import { RegisterDto } from './dto/RegisterDto';

@Injectable()
export class AppService {
  private readonly baseUrl: string;
  private readonly realm: string;
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor(private readonly config: ConfigService) {
    this.baseUrl = this.config.get<string>('KEYCLOAK_BASE_URL') ?? '';
    this.realm = this.config.get<string>('KEYCLOAK_REALM') ?? '';
    this.clientId = this.config.get<string>('KEYCLOAK_CLIENT_ID') ?? '';
    this.clientSecret = this.config.get<string>('KEYCLOAK_CLIENT_SECRET') ?? '';
  }


  async getAdminToken(): Promise<string> {
    const res = await axios.post(
      `${this.baseUrl}/realms/${this.realm}/protocol/openid-connect/token`,
      qs.stringify({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials',
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );
    return res.data.access_token;
  }

  async registerUser(data: RegisterDto): Promise<void> {

    const adminToken = await this.getAdminToken();

    await axios.post(
      `${this.baseUrl}/admin/realms/${this.realm}/users`,
      {
        username: data.email,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        enabled: true,
        emailVerified: true,
        credentials: [
          {
            type: 'password',
            value: data.password,
            temporary: false,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      }
    )
  }

  async loginUser(data: LoginDto) {
    const result = await axios.post(
      `${this.baseUrl}/realms/${this.realm}/protocol/openid-connect/token`,
      qs.stringify({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'password',
        username: data.username,
        password: data.password,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );
    if(!result){
      throw new UnauthorizedException("Username or Password is wrong");
    }
    return result.data;
  }

  async assignRolesToUser(userId: string, roles: string[]) {
    const adminToken = await this.getAdminToken();

    const user = await this.getUser(userId);

    if(!user) {
      throw new NotFoundException('User Not Found');
    }

    const allRolesRes = await axios.get(
      `${this.baseUrl}/admin/realms/${this.realm}/roles`,
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      },
    );

    const roleObjects = allRolesRes.data.filter((role) => roles.includes(role.name));

    if (!roleObjects.length) {
      throw new NotFoundException('No matching roles found');
    }

    // Assign all selected roles
    await axios.post(
      `${this.baseUrl}/admin/realms/${this.realm}/users/${userId}/role-mappings/realm`,
      roleObjects,
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      },
    );
  }


  async getUserRoles(userId: string): Promise<string[]> {
    const token = await this.getAdminToken();

    const user = await this.getUser(userId);

    if(!user) {
      throw new NotFoundException('User Not Found');
    }

    const res = await axios.get(
      `${this.baseUrl}/admin/realms/${this.realm}/users/${userId}/role-mappings/realm`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return res.data.map((role) => role.name);
  }


  async getUser(userId: string) {
    const token = await this.getAdminToken();

    const res = await axios.get(
      `${this.baseUrl}/admin/realms/${this.realm}/users/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if(!res) {
      throw new NotFoundException('User not found');
    }
    return res.data;
  }


  async unassignRolesFromUser(userId: string, roleNames: string[]) {
    const adminToken = await this.getAdminToken();

    const user = await this.getUser(userId);

    if(!user) {
      throw new NotFoundException('User Not Found');
    }

    // Get all available realm roles
    const allRolesRes = await axios.get(
      `${this.baseUrl}/admin/realms/${this.realm}/roles`,
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      },
    );

    // Filter to only roles to be removed
    const rolesToRemove = allRolesRes.data.filter((role) => roleNames.includes(role.name));

    if (!rolesToRemove.length) {
      throw new NotFoundException('No matching roles found to remove.');
    }

    // Call Keycloak API to unassign roles
    await axios.request({
      method: 'delete',
      url: `${this.baseUrl}/admin/realms/${this.realm}/users/${userId}/role-mappings/realm`,
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      data: rolesToRemove,
    });
  }

}
