# peerpad-peer-crdt

This is a Dapp experimental replacement of Peerpad using `react`, `peer-crdt`, `peer-identity`, and `dapp_identity_api` for logins and proofs/attestations.

## Dev

```sh
npm install
npm start
```

## Prod

_Make sure to edit the valules in the [production config file](./.env.production)._

```sh
npm install
npm run build
```

This will create an optimized build inside `build/`.

## Login Service

Follow the instructions on [dapp_identity_api](https://github.com/ipfs-shipyard/dapp-identity-api).
