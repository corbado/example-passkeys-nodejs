# Node.js (Express) Passkey Example App

This is a sample implementation of frontend and backend where the Corbado Node.js SDK and Web-js components are
integrated in an Express application.

## 1. File structure

```
├── ...
├── .env                        # Environment variables for the application
├── src                             
│   ├── app.ts                  # Application Entrypoint
│   ├── routes.ts               # Defines our routes 
│   ├── authController.ts       # Handles all of our endpoints
│   └── userService.ts          # Service to manage User data
└── ...
```

## 2. Setup

### 2.1. Configure environment variables

Please follow our [Getting started](https://docs.corbado.com/overview/getting-started) page to create and
configure a project in the [developer panel](https://app.corbado.com).

Use the values you obtained above to configure the following variables inside `.env`:

1. **PROJECT_ID**: The project ID.
2. **API_SECRET**: The API secret.

### 2.2. Run the Express App


Use the following command to install all dependencies:

```
npm i
```

Now, you're ready to run the app like this:

```
npm run start
```

## 3. Usage

After step 2 your local server should be fully working.

### 3.1. Test authentication

If you now visit `http://localhost:3000`, you should be seeing our authentication UI.

Create an account and take a look at the profile page under `/profile` you'll be forwarded to.
