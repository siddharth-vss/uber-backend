<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

To install the dependencies, run:

```bash
$ npm install
```

## Running the app

To start the application in different modes, use the following commands:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

To run tests, use the following commands:

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Prisma

This project uses Prisma as the ORM (Object-Relational Mapping) tool. Prisma helps in managing the database schema and performing database operations.

### Prisma Schema

The Prisma schema is defined in the `prisma/schema.prisma` file. It includes the data models and their relations.

### Migrations

Database migrations are managed using Prisma Migrate. The migration files are located in the `prisma/migrations` directory.

To create a new migration, run:
```bash
$ npx prisma migrate dev --name <migration_name>
```

To apply pending migrations, run:
```bash
$ npx prisma migrate deploy
```

### Prisma Client

The Prisma Client is generated based on the schema and is used to interact with the database. It is generated in the `node_modules/.prisma/client` directory.

To generate the Prisma Client, run:
```bash
$ npx prisma generate
```

### Environment Variables

The database connection URL and other environment variables are defined in the `.env` file.

#### Example `.env` file

```properties
DATABASE_URL='postgresql://username:password@host:port/database?sslmode=require'
JWT_SECRET='your_jwt_secret'
```

## Database Tables and Models

The database schema is defined using Prisma models in the `prisma/schema.prisma` file. Below are the main models and their corresponding tables:

### User Model

The `User` model represents the users of the application. It is mapped to the `User` table in the database.

```prisma
model User {
  id             String       @id @default(uuid())
  fullname       Json         // JSON field to store { firstname, lastname }
  email          String       @unique
  password_hash  String
  source         String
  socketId       String
  rides          Ride[]
}
```

### Captain Model

The `Captain` model represents the captains (drivers) of the application. It is mapped to the `Captain` table in the database.

```prisma
model Captain {
  id             String       @id @default(uuid())
  fullname       Json  // JSON field to store { firstname,lastname }
  email          String       @unique
  password       String
  source         String
  socketId       String
  status         Status       @default(inactive)
  vehicle        Json
  location       Json
  rides          Ride[]
}
```

### BlacklistToken Model

The `BlacklistToken` model represents tokens that have been blacklisted. It is mapped to the `BlacklistToken` table in the database.

```prisma
model BlacklistToken {
  id          String       @id @default(uuid())
  token       String       @unique
  createdAt   DateTime     @default(now())
}
```

### Ride Model

The `Ride` model represents the rides in the application. It is mapped to the `Ride` table in the database.

```prisma
model Ride {
  id             String       @id @default(uuid())
  user           User         @relation(fields: [userId], references: [id])
  userId         String
  captain        Captain      @relation(fields: [captainId], references: [id])
  captainId      String
  pickup         String
  destination    String
  fare           Int
  status         RideStatus   @default(pending)
  duration       Int
  distance       Int
  paymentId      String
  orderId        String
  signature      String
  createdAt      DateTime     @default(now())
  otp            String
}
```

### Enums

The schema also defines several enums used in the models.

#### Status Enum

Represents the status of a captain.

```prisma
enum Status {
  active
  inactive
}
```

#### RideStatus Enum

Represents the status of a ride.

```prisma
enum RideStatus {
  pending
  accepted
  ongoing
  completed
  cancelled
}
```

#### VehicleType Enum

Represents the type of vehicle.

```prisma
enum VehicleType {
  car
  bike
  auto
}
```

## API Endpoints

### User Routes

The `UserController` handles the routes related to users. Below are the available routes and their descriptions:

- **GET /users**

  Fetches all users.

  ```typescript
  @Get()
  getUsers(): string {
    return 'Get all users';
  }
  ```

- **GET /users/profile**

  Fetches the profile of the currently logged-in user.

  ```typescript
  @Get('profile')
  getUser(@Req() req: Request) {
    const user = req.user;
    return `Get user with id: ${user?.id || 'undefined'}`;
  }
  ```

- **GET /users/logout**

  Logs out the currently logged-in user.

  ```typescript
  @Get('logout')
  logoutUser() {
    return `Get user with id: `;
  }
  ```

- **POST /users/login**

  Logs in a user with the provided email and password.

  ```typescript
  @Post('login')
  async loginUser(@Body() data: Login) {
    return await this.userService.login(data);
  }
  ```

  #### Request Body

  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

  #### Login Interface

  ```typescript
  export interface Login {
    email: string;
    password: string;
  }
  ```

- **POST /users/register**

  Registers a new user with the provided email and password.

  ```typescript
  @Post('register')
  async registerUser(@Body() data: Register) {
    return await this.userService.register(data);
  }
  ```

  #### Request Body

  ```json
  {
    "email": "newuser@example.com",
    "password": "password123",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "socketId": "optionalSocketId"
  }
  ```

  #### Register Interface

  ```typescript
  export interface Register extends Login {
    fullname: {
      firstname: string;
      lastname?: string;
    };
    socketId?: string;
  }
  ```

### Captain Routes

The `CaptainController` handles the routes related to captains. Below are the available routes and their descriptions:

- **GET /captains**

  Fetches all captains.

  ```typescript
  @Get()
  async getAllCaptains() {
    return await this.captainService.getAllCaptains();
  }
  ```

- **GET /captains/profile**

  Fetches the profile of the currently logged-in captain.

  ```typescript
  @Get('profile')
  getCaptain(@Req() req: Request) {
    const captain = req.captain;
    return `Get captain with id: ${captain?.id || 'undefined'}`;
  }
  ```

- **GET /captains/logout**

  Logs out the currently logged-in captain.

  ```typescript
  @Get('logout')
  async logoutCaptain(@Req() req: Request, @Res() res: Response) {
    return await this.captainService.logoutCaptain(req, res);
  }
  ```

- **POST /captains/login**

  Logs in a captain with the provided email and password.

  ```typescript
  @Post('login')
  async loginCaptain(@Body() data: Login) {
    return await this.captainService.login(data);
  }
  ```

  #### Request Body

  ```json
  {
    "email": "captain@example.com",
    "password": "password123"
  }
  ```

  #### Login Interface

  ```typescript
  export interface Login {
    email: string;
    password: string;
  }
  ```

- **POST /captains/register**

  Registers a new captain with the provided email and password.

  ```typescript
  @Post('register')
  async registerCaptain(@Body() data: Register) {
    return await this.captainService.register(data);
  }
  ```

  #### Request Body

  ```json
  {
    "email": "newcaptain@example.com",
    "password": "password123",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "vehicle": {
      "color": "red",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    },
    "location": {
      "ltd": 12.34,
      "lng": 56.78
    },
    "socketId": "optionalSocketId"
  }
  ```

  #### Register Interface

  ```typescript
  export interface Register extends Login {
    fullname: {
      firstname: string;
      lastname?: string;
    };
    vehicle: {
      color: string;
      plate: string;
      capacity: number;
      vehicleType: 'car' | 'motorcycle' | 'auto';
    };
    location?: {
      ltd?: number;
      lng?: number;
    };
    socketId?: string;
  }
  ```

### Example Usage

Here is an example of how to use the `UserController` in a client:

```typescript
import axios from 'axios';

const baseUrl = 'http://localhost:3000/users';

// Fetch all users
axios.get(baseUrl).then(response => {
  console.log(response.data);
});

// Fetch user profile
axios.get(`${baseUrl}/profile`).then(response => {
  console.log(response.data);
});

// Logout user
axios.get(`${baseUrl}/logout`).then(response => {
  console.log(response.data);
});

// Login user
axios.post(`${baseUrl}/login`, {
  email: 'user@example.com',
  password: 'password123'
}).then(response => {
  console.log(response.data);
});

// Register user
axios.post(`${baseUrl}/register`, {
  fullname:{
    firstname:"new",
    lastname:"user"
  },
  email: 'newuser@example.com',
  password: 'password123'
}).then(response => {
  console.log(response.data);
});
```


Here is an example of how to use the `CaptainController` in a client:

```typescript
import axios from 'axios';

const baseUrl = 'http://localhost:3000/captains';

// Fetch all captains
axios.get(baseUrl).then(response => {
  console.log(response.data);
});

// Fetch captain profile
axios.get(`${baseUrl}/profile`).then(response => {
  console.log(response.data);
});

// Logout captain
axios.get(`${baseUrl}/logout`).then(response => {
  console.log(response.data);
});

// Login captain
axios.post(`${baseUrl}/login`, {
  email: 'captain@example.com',
  password: 'password123'
}).then(response => {
  console.log(response.data);
});

// Register captain
axios.post(`${baseUrl}/register`, {
  email: 'newcaptain@example.com',
  password: 'password123',
  fullname: {
    firstname: 'John',
    lastname: 'Doe'
  },
  vehicle: {
    color: 'red',
    plate: 'ABC123',
    capacity: 4,
    vehicleType: 'car'
  },
  location: {
    ltd: 12.34,
    lng: 56.78
  }
}).then(response => {
  console.log(response.data);
});
```

## UserService

The `UserService` is responsible for handling operations related to users. It uses the Prisma Client to interact with the database.

### Methods

- **createUser**

  Creates a new user.

  ```typescript
  async createUser(user: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data: user });
  }
  ```

- **register**

  Registers a new user.

  ```typescript
  async register(data: Register) {
    // Implementation
  }
  ```

- **login**

  Logs in a user.

  ```typescript
  async login(data: Login) {
    // Implementation
  }
  ```

- **getAllUsers**

  Fetches all users.

  ```typescript
  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }
  ```

- **getUserById**

  Fetches a user by ID.

  ```typescript
  async getUserById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }
  ```

- **updateUser**

  Updates a user.

  ```typescript
  async updateUser(id: string, user: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({ where: { id }, data: user });
  }
  ```

- **deleteUser**

  Deletes a user.

  ```typescript
  async deleteUser(id: string): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }
  ```

## CaptainService

The `CaptainService` is responsible for handling operations related to captains. It uses the Prisma Client to interact with the database.

### Methods

- **createCaptain**

  Creates a new captain.

  ```typescript
  async createCaptain(captain: Prisma.CaptainCreateInput): Promise<Captain> {
    return this.prisma.captain.create({ data: captain });
  }
  ```

- **register**

  Registers a new captain.

  ```typescript
  async register(data: Register) {
    // Implementation
  }
  ```

- **login**

  Logs in a captain.

  ```typescript
  async login(data: Login) {
    // Implementation
  }
  ```

- **getAllCaptains**

  Fetches all captains.

  ```typescript
  async getAllCaptains(): Promise<Captain[]> {
    return this.prisma.captain.findMany();
  }
  ```

- **getCaptainById**

  Fetches a captain by ID.

  ```typescript
  async getCaptainById(id: string): Promise<Captain | null> {
    return this.prisma.captain.findUnique({ where: { id } });
  }
  ```

- **updateCaptain**

  Updates a captain.

  ```typescript
  async updateCaptain(id: string, captain: Prisma.CaptainUpdateInput): Promise<Captain> {
    return this.prisma.captain.update({ where: { id }, data: captain });
  }
  ```

- **deleteCaptain**

  Deletes a captain.

  ```typescript
  async deleteCaptain(id: string): Promise<Captain> {
    return this.prisma.captain.delete({ where: { id } });
  }
  ```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in Touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
