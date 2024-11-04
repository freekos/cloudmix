import { ApiGatewayManagementApiClient } from '@aws-sdk/client-apigatewaymanagementapi';
import { env } from '../configs/env';

export const apiGatewayManagementClient = new ApiGatewayManagementApiClient({
  endpoint: env.AWS_API_GATEWAY_ENDPOINT,
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});
