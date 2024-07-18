import { registerAs } from '@nestjs/config';
import { APP_CONFIG_TOKEN, IAppConfig } from '../app.config';
import * as process from 'node:process';

export const cliLoader = registerAs(APP_CONFIG_TOKEN, () => {
  const args = process.argv.slice(2);

  if (args.includes('-h') || args.includes('--help')) {
    printHelp();
    process.exit(0);
  }

  const config = validateConfig(args);

  return {
    url: config['url'],
    package: config['package'],
    protoPath: config['proto'],
    serviceName: config['service'],
    rpcName: config['rpc'],
    payload: config['data'],
  };
});

function getFlagIndex(args, flags) {
  let index = -1;
  args.forEach((value, i) => {
    if (flags.includes(value)) {
      index = i;
    }
  });

  return index;
}

function validateFlag(args, flags, alias, config, options) {
  const flagIndex = getFlagIndex(args, flags);
  if (flagIndex === -1) {
    options.missingFlags.push(`${alias} is missing.`);
    options.isValid = false;
  } else {
    config[alias] = args[flagIndex + 1];
  }
}

function validateConfig(args) {
  const options = {
    isValid: true,
    missingFlags: [],
  };
  const config = {};

  validateFlag(args, ['--url', '-u'], 'url', config, options);
  validateFlag(args, ['--package', '-p'], 'package', config, options);
  validateFlag(args, ['--proto', '-P'], 'proto', config, options);
  validateFlag(args, ['--service', '-s'], 'service', config, options);
  validateFlag(args, ['--rpc', '-r'], 'rpc', config, options);
  validateFlag(args, ['--data', '-d'], 'data', config, options);

  try {
    config['data'] = JSON.parse(config['data']);
  } catch (e) {
    options.isValid = false;
    options.missingFlags.push('data must be a json string.');
  }

  if (!options.isValid) {
    for (const item of options.missingFlags) {
      console.log(item);
    }
    printHelp();
    process.exit(0);
  }

  return config;
}

function printHelp() {
  console.log('--url, -u: target gRPC url');
  console.log('--package, -p: gRPC package name');
  console.log('--proto, -P: gRPC proto file path');
  console.log('--service, -s: gRPC service name');
  console.log('--rpc, -r: gRPC rpc name');
  console.log('--data, -d: gRPC payload');
}
