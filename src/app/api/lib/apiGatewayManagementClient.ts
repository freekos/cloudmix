import { ApiGatewayManagementApiClient } from '@aws-sdk/client-apigatewaymanagementapi';
import { env } from '../configs/env';

export const apiGatewayManagementClient = new ApiGatewayManagementApiClient({
  endpoint: env.AWS_API_GATEWAY_ENDPOINT,
  region: env.AWS_REGION,
});
