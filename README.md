## Memories App

This app is created using Remix and MongoDB to store your memories, also used Prisma ORM.

Following are the models:

-   Post

## Usage

Clone the project via git clone or download the zip file.

### .env

Copy contents of .env.example file to .env file and add your MongoDB URL.

### Install Dependencies

cd into the project directory via terminal and run the following command to install dependencies.

```sh
npm install
```

### Seed Database

Run following command to seed your database with dummy posts.

```sh
npx prisma db seed
```

### Development Server

From your terminal:

```sh
npm run dev
```

This starts your app in development mode. Visit: http://localhost:3000
