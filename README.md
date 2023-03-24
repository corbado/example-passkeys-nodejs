# Complete integration sample for the Corbado web component in Node.js
This is a sample implementation of frontend and backend where the Corbado web component is integrated.

**Note:** In this tutorial a customer system is created with some pre-existing password-based users. Have a look at our [docs](https://docs.corbado.com/integrations/web-component/no-existing-user-base) to see the integration if you don't have any users yet.

## 1. File structure
        ├── ...
        ├── .env                                     # Environment variables for the application
        ├── app.js                                   # Starting point for the application
        ├── config      
        │   └── routes.yaml                          # Configuration file for the MySQL database
        ├── models      
        │   └── user.model.js                        # Defines user model
        ├── src                             
        │   ├── controllers                  
        │   │   ├── authController.js                # Manages logic for authentication
        │   │   ├── corbadoWebhookConroller.js       # Manages logic for Corbado webhook
        │   │   └── userController.js                # Manages logic for user
        │   ├── routes                  
        │   │   ├── authRoutes.js                    # Manages endpoints for authentication
        │   │   └── corbadoWebhookRoutes.js          # Manages endpoints for Corbado webhook
        │   └── views
        │       └── pages
        │           ├── index.ejs                   # Home page view contains Corbado web component
        │           └── profile.ejs                 # Profile page view
        └── ...
