# Hunger Hunter

It's a restaurant website for practice with node.js, express.js and mongodb.

### Users could...

- see all the restaurant name, category, rating and description in our datasets.

- click the card or detail button to see restaurant information, such as address and phone number.

- search restaurant.

- edit the restaurant information.

- delete the restaurant card.

- create a new restaurant to website.

- sort the information of restaurants.

  ![webpages](./public/images/capweb_v3.png)

### Getting Started

- Clone repository to your local project

```bash
git clone git@github.com:ccyang02/hunger_hunter.git
```

- Install dependencies

```bash
cd hunger_hunter
npm install
```

- Prepare your mongoDB database and make sure it is active
- Run the project and show output information on the terminal

```bash
npm run seed
npm run dev

> Express is listening on port 3000
```

### Built with

- Node.js: 10.16.0
- express: 4.17.1
- express-handlebars: 5.1.0
- mongoDB: 2.1.0