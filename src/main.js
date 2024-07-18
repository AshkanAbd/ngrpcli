import { NestFactory } from '@nestjs/core';
import { cliLoader } from './loaders/cli.loader';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_CONFIG_TOKEN } from './app.config';
import { GrpcClientService } from './grpc-client.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

export class GrpcClientModule {}

async function loadConfig() {
  const appContext = await NestFactory.createApplicationContext(
    ConfigModule.forRoot({
      load: [cliLoader],
    }),
    {
      logger: false,
    },
  );

  return appContext.get(ConfigService);
}

async function bootstrap() {
  const configService = await loadConfig();
  const appConfig = configService.get(APP_CONFIG_TOKEN);

  const app = await NestFactory.create(
    {
      module: GrpcClientModule,
      imports: [
        ClientsModule.register([
          {
            name: 'RPC_PACKAGE',
            transport: Transport.GRPC,
            options: {
              package: appConfig.package,
              protoPath: appConfig.protoPath,
              url: appConfig.url,
            },
          },
        ]),
      ],
      providers: [GrpcClientService],
      exports: [GrpcClientService],
    },
    {
      logger: false,
    },
  );

  await app.init();
  const service = await app.resolve(GrpcClientService);
  service.loadService(appConfig.serviceName);
  const response = await service.callRpc(appConfig.rpcName, appConfig.payload);
  console.log(JSON.stringify(response));
}

bootstrap();
