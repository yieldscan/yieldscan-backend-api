# YieldScan Backend Api

## Overview:

This repo manages api endpoints for the [YieldScan](https://yieldscan.app) backend.

## Development:

We are always working on improving our codebase, and welcome any suggestions or contributions.

### Contribution Guide:

1. Create an issue for the improvement.

2. Fork the repo and make changes.

3. Make a PR.

### Codebase Overview:

Important packages:

- [src/config](https://github.com/yieldscan/yieldscan-backend-api/tree/master/src/config): Here we define configurations for the application(supported networks, etc).

- [src/api](https://github.com/yieldscan/yieldscan-backend-api/tree/master/src/api): Here we define different middlewares and routes for different endpoints.

- submodules:
  - [src/models](https://github.com/yieldscan/ys-models): Schema for the database.
  - [src/interfaces](https://github.com/yieldscan/ys-interfaces): Interfaces for the models.

Api Endpoints:

- Validators risk-set: `/api/<network>/rewards/risk-set`
- Nominators: `/api/<network>/actors/nominators`
- Validator profile: `/api/<network>/validator/<validatorStashId>`
- Historic rewards for a nominator: `/<network>/actors/nominator/overall_history?id=<address>&activeEra=<activeEra>`
- Council Members:`api/<network>/council/members`
- Council Member data: `api/<network>/council/member/<councilMemberAccountId>`

### Development Guide:

#### Pre-requisite:

- MongoDb connection url, make sure you have a running mongodb instance.

  - this [article](https://zellwk.com/blog/local-mongodb/#:~:text=To%20connect%20to%20your%20local,databases%20in%20your%20local%20MongoDB.) can help setting an instance locally.

Clone this or forked repository:

```
git clone --recursive https://github.com/yieldscan/yieldscan-backend-api
```

Note: `--recursive` is for cloning the submodules. If you already have cloned the repository without the `--recursive` argument and now want to load it’s submodules you have to run `git submodule update --init` inside the main folder of the repo.

cd into the main folder:

```
cd yieldscan-backend-api
```

The first time, you will need to run:

```
npm install
```

Define the following environment variables in a `.env` file inside the main folder:

```
# MongoDb connection url
MONGODB_URI=<your mongodb connection url>

domain='https://yieldscan.app'
LOG_LEVEL='silly'
```

Then just start the server with

For development:

```
npm run dev
```

It uses nodemon in development for livereloading ✌️

**IMPORTANT NOTE:** When creating the database for the first time, it would might take around 30-45 minutes for all data endpoints to start functioning.

For production use:

```
npm start
# or
npm run start
```

### Git commit

- Run `npm run git:commit` for commiting your code and follow the process.

## Docker:

You can run a docker container via -

```
docker run -e MONGODB_URI=<your mongodb connection url> -t sahilnanda/yieldscan-api
```

## Tests:

You can run tests via -

```
npm run test
```
