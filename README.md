
# FSA Capstone Project - Backend
This is the backend component of the FSA Capstone project, as part of the Full-Stack Academy curriculum.

The FSA Capstone is a full-stack e-commerce web application that allows users to purchase galactic-themed products. The backend is built using Node.js and Express, and provides [frontend](https://github.com/mayamauchi/FSA-Capstone-EcommerceSite) with a RESTful API that handles user authentication, products, active/inactive carts and database interactions. For this application, we used PostgreSQL for the database. Stripe's API is integrated in the backend as well for user checkout experience. 

## Authors

- [@mayamauchi](https://www.github.com/mayamauchi)
- [@mclovintime](https://github.com/mclovintime)
- [@jtylerferguson](https://github.com/jtylerferguson)
- [@lucasawest](https://github.com/lucasawest)



## Run Locally

Clone the project

```bash
git clone https://github.com/mayamauchi/FSA-Capstone-Backend.git
```

Go to the project directory

```bash
cd FSA-Capstone-Backend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start:dev
```

Start seed

```bash
  npm run seed:dev
```
This will start the server on port 3000 by default. You can change the port by setting the PORT environment variable.



## API Reference

#### Get all items

```http
  GET /api/products
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Get item

```http
  GET /api/products/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |



