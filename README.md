# Node.js (Express) Passkey Example App

This is a sample implementation of frontend and backend where the Corbado Node.js SDK and Web-js components are integrated.
We'll use a MySQL database to store our own user data and hook it up with Corbado.

## 1. File structure
```
├── ...
├── .env                        # Environment variables for the application
├── config      
│   └── config.js               # Configuration file for the MySQL database
├── models      
│   └── index.ts                # Defines user model
├── src                             
│   ├── app.ts                  # Application Entrypoint
│   ├── routes.ts               # Defines our routes 
│   ├── authController.ts       # Handles all of our endpoints
│   └── userService.ts          # Service to manage User data
└── ...
```

## 2. Setup

### 2.1. Configure environment variables

**Automatic Setup**

You can download this repository directly from our [examples](https://app.corbado.com/app/getting-started/examples)
page, where all environment variables and other necessary parameters will be configured automatically. In that case, you
can skip the following manual setup step, and proceed to step 2.2.

**Manual Setup**

Please follow our [Getting started](https://docs.corbado.com/overview/getting-started) page to create and
configure a project in the [developer panel](https://app.corbado.com).

Use the values you obtained above to configure the following variables inside `.env`:

1. **PROJECT_ID**: The project ID.
2. **API_SECRET**: The API secret.

### 2.2. Start Docker containers

**Note:** Before continuing, please ensure you have [Docker](https://www.docker.com/products/docker-desktop/) installed
and accessible from your shell.

Use the following command to start the system:

```
docker compose up
```

**Note:** Please wait until all containers are ready. This can take some time.

## 3. Usage

After step 2.3. your local server should be fully working.

### 3.1. Test authentication

If you now visit `http://localhost:3000`, you should be seeing our authentication UI.

Create an account and take a look at the profile page under `/profile` you'll be forwarded to.
