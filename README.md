# Getting Started

Before starting the services, make sure to set up the necessary environment variables. **Go to [Link](https://docs.google.com/spreadsheets/d/1o7DnviMjOyH5QuX2fmfkFewxplx3xGmmHtlI5r1o5Ys/edit?usp=sharing) to get the required `.env` files**.

To start the various services in the project, run the following commands in separate terminal windows:

### Frontend Apps

- **Admin Dashboard**
  ```bash
  yarn start:camformant-admin
  ```
- **Client Commpany**
  ```bash
  yarn start:frontend-client
  ```
- **Client User**
  ```bash
  yarn start:camformant-client
  ```

### Backend Services

- **User Service**
  ```bash
  yarn start:user-service
  ```
- **Authentication Service**
  ```bash
  yarn start:auth-service
  ```
- **Chat Service**
  ```bash
  yarn start:chat-service
  ```
- **Job Service**
  ```bash
  yarn start:job-service
  ```
- **Notification Service**
  ```bash
  yarn start:notification-service
  ```
- **API Gateway**
  ```bash
  yarn start:api-gateway-service
  ```

Make sure you have all dependencies installed by running `yarn install` in the root directory before starting the services.
