# ngrpcli: lightweight node gRPC cli client

### How to use:
#### Installation:
```shell
npm i -g ngrpcli
```

#### Flags:
```
--url, -u: target gRPC url
--package, -p: gRPC package name
--proto, -P: gRPC proto file path
--service, -s: gRPC service name
--rpc, -r: gRPC rpc name
--data, -d: gRPC payload
```

#### Example:
```shell
npx ngrpcli -u localhost:5000 -p package -P /path/to/my.proto -s Service -r Rpc -d "{\"data\": \"my payload\"}"
```

### Build from source:
#### Requirements:
| Lib    | Version |
|--------|---------|
| Node   | 18      |
| NestJS | 10      |

#### Build:
```shell
nvm use # Switch to node version
npm i # To install dependencies
```

#### Run:
```shell
npm run start
```
