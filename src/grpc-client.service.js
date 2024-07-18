import { Dependencies, Inject, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
@Dependencies('RPC_PACKAGE')
export class GrpcClientService {
  constructor(client) {
    this.client = client;
  }

  loadService(serviceName) {
    this.serviceName = serviceName;
    this.rpcService = this.client.getService(serviceName);
  }

  async callRpc(rpcName, payload) {
    if (typeof this.rpcService[rpcName] !== 'function') {
      throw new Error(
        `"${this.serviceName}" service doesn't have "${rpcName}" rpc.`,
      );
    }
    return await lastValueFrom(this.rpcService[rpcName](payload));
  }
}
