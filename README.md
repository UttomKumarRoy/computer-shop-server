# Computer Shop Server

This is a simple Express application.


## Live Link

You can access the live version of the application here:

[Live Application](https://computer-shop-server.vercel.app/)

## Installation

1. **Clone the repository**
    ```sh
    git clone https://github.com/UttomKumarRoy/computer-shop-server
    ```

2. **Navigate to the project directory**
    ```sh
    cd computer-shop-server
    ```

3. **Install dependencies**
    ```sh
    npm install
    ```

## Usage

1. **Create a `.env` file in the root directory of your project and add your environment variables**

    ```env
    PORT=3000
    SECRET=your-secret-key
    DATABASE_URL=your-database-url
    ```

2. **Start the application**

    ```sh
    npm start
    ```

3. **Open your browser and navigate to**

    ```
    http://localhost:3000
    ```

## Environment Variables

The application requires the following environment variables:

- `PORT`: The port number on which the server will run.
- `SECRET`: A secret key for session management or other security purposes.
- `DATABASE_URL`: The URL to connect to your database.

Ensure you create a `.env` file in the root of your project with the necessary variables. Example:

```env
PORT=3000
SECRET=your-secret-key
DATABASE_URL=your-database-url
