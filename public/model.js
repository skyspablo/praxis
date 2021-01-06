class DBModel {
    //knex
    _db = require('knex')({
        client: 'mysql',
        connection: {
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'praxis'
        }
    });

    _md5 = require('md5');

    async login(username, password) {
        return new Promise((resolve, reject) => {
            const mysql = new MySQL();
            mysql.query(`select * from users where username = '${username}' and password = '${this._md5(password)}' limit 1`)
                .then((r) => {

                    resolve(r)
                })
                .catch((err) => reject(err));

        });
    }
}

class MySQL {
    _mysql = require('mysql');
    _conn = this._mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "praxis"
    });

    async query(query) {
        return new Promise((resolve, reject) => {
            this._conn.connect();
            this._conn.query(query, function (error, results, fields) {
                if (error) {
                    reject(error)
                } else {
                    resolve(results)
                }
            });
            this._conn.end();
        })
    }

    async listTable({sql, page = 1, limit = 10}) {
        return new Promise( (resolve, reject) => {
            this._conn.connect();
            this._conn.query(sql, (error,results,fields) => {
                if(error){
                    reject(error)
                }else{
                    let finalData = results;

                    finalData = finalData.slice((page-1)*limit, limit*(page));
                    const lastPage = Math.ceil(results.length/limit)
                    const response = {
                        current_page: page,
                        last_page: lastPage,
                        data: finalData
                    }
                    resolve(response)
                }
            })
            this._conn.end();
        })
    }

}

class User extends DBModel {

    constructor(
        {
            id = 0,
            username = "",
            password = "",
            active = false,
            permissions = "",
            created = "",
            updated = ""
        }) {
        super();
        this._id = id;
        this._username = username;
        this._password = password;
        this._active = active;
        this._permissions = permissions;
        this._created = created;
        this._updated = updated;

    }

    async create() {
        return false;
    }

    get id() {
        return this._id;
    }

    get username() {
        return this._username;
    }

    get password() {
        return this._password;
    }

    get active() {
        return this._active;
    }

    get permissions() {
        return this._permissions;
    }

    get created() {
        return this._created;
    }

    get updated() {
        return this._updated;
    }
}

class Product extends DBModel {
    get existence() {
        return this._existence;
    }

    constructor(
        {
            id = 0,
            sku = "",
            category_id = 0,
            currency_id = 0,
            name = "",
            price = 0.0,
            existence = 0,
            active = false,
            created = "",
            updated = "",
        }) {
        super();
        this._id = id;
        this._sku = sku;
        this._category_id = category_id;
        this._currency_id = currency_id;
        this._name = name;
        this._price = price;
        this._active = active;
        this._created = created;
        this._updated = updated;
        this._existence = existence;
    }

    async listTable({page = 1, limit = 10, search = ''}){
        return new Promise((resolve, reject) => {
            let sql;
            if(search === ""){
                sql = 'SELECT * FROM products order by id desc';
            }else{
                sql = `SELECT * FROM products WHERE (name like '%${search}%' or id like '%${search}%' or sku like '%${search}%') order by id desc`;
            }

            const mysql = new MySQL();
            mysql.listTable({sql:sql, page: page, limit: limit})
                .then((r) => {
                    resolve(r)
                })
                .catch((err) => reject(err));

        });
    }

    async list({page = 1, limit = 10, search = ''}) {

        return new Promise((resolve, reject) => {
            let sql = 'SELECT * FROM products ';
            if (search !== '') {
                sql += ` WHERE 
                            ( name like %${search}% OR 
                            id like %${search}% OR 
                            price like %${search}%) `
            }

            sql += `order by id desc LIMIT ${limit} OFFSET ${page - 1} `

            const mysql = new MySQL();

            mysql.query(sql)
                .then((r) => {
                    resolve(r)
                })
                .catch((err) => reject(err));

        });
    }

    async create(productData) {

        return new Promise((resolve, reject) => {
            const mysql = new MySQL();
            mysql.query(`
                    INSERT INTO products (sku, existence, category_id, currency_id, name, price, active, created) 
                    VALUES ('${productData.sku}', '${productData.existence}', '${productData.category_id}', 1, '${productData.name}', '${productData.price}', 1, NOW() )`)
                .then((r) => {
                    resolve(r)
                })
                .catch((err) => reject(err));
        });
    }

    get id() {
        return this._id;
    }

    get sku() {
        return this._sku;
    }

    get category_id() {
        return this._category_id;
    }

    get currency_id() {
        return this._currency_id;
    }

    get name() {
        return this._name;
    }

    get price() {
        return this._price;
    }

    get active() {
        return this._active;
    }

    get created() {
        return this._created;
    }

    get updated() {
        return this._updated;
    }
}

class Category extends DBModel {

    constructor({
                    id = 0,
                    name = "",
                    created = "",
                    updated = ""
                }) {
        super();
        this._id = id;
        this._name = name;
        this._created = created;
        this._updated = updated;
    }

    async listAll() {

        return new Promise((resolve, reject) => {
            let sql = 'SELECT * FROM categories ';
            const mysql = new MySQL();
            mysql.query(sql)
                .then((r) => {
                    resolve(r)
                })
                .catch((err) => reject(err));
        });
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    get created() {
        return this._created;
    }

    get updated() {
        return this._updated;
    }
}

class Currency extends DBModel {
    constructor({
                    id = 0,
                    name = "",
                    buy = "",
                    sell = "",
                    created = "",
                    updated = "",
                    active = false
                }) {
        super();
        this._id = id;
        this._name = name;
        this._buy = buy;
        this._sell = sell;
        this._created = created;
        this._updated = updated;
        this._active = active;
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    get buy() {
        return this._buy;
    }

    get sell() {
        return this._sell;
    }

    get created() {
        return this._created;
    }

    get updated() {
        return this._updated;
    }

    get active() {
        return this._active;
    }
}

class Customer extends DBModel {
    constructor({
                    id = 0,
                    name = "",
                    document = "",
                    document_type = "ci",
                    phone = "",
                    email = "",
                    birthday = ""
                }) {
        super();
        this._id = id;
        this._name = name;
        this._document = document;
        this._document_type = document_type;
        this._phone = phone;
        this._email = email;
        this._birthday = birthday;
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    get document() {
        return this._document;
    }

    get document_type() {
        return this._document_type;
    }

    get phone() {
        return this._phone;
    }

    get email() {
        return this._email;
    }

    get birthday() {
        return this._birthday;
    }
}

class Sell extends DBModel {
    constructor({
                    id = 0,
                    user_id = 0,
                    customer_id = 0,
                    total = 0,
                    total_tax = 0,
                    created = "",
                    updated = ""
                }) {
        super();
        this._id = id;
        this._user_id = user_id;
        this._customer_id = customer_id;
        this._total = total;
        this._total_tax = total_tax;
        this._created = created;
        this._updated = updated;
    }

    get id() {
        return this._id;
    }

    get user_id() {
        return this._user_id;
    }

    get customer_id() {
        return this._customer_id;
    }

    get total() {
        return this._total;
    }

    get total_tax() {
        return this._total_tax;
    }

    get created() {
        return this._created;
    }

    get updated() {
        return this._updated;
    }
}

class SellDetails extends DBModel {
    constructor({
                    id = 0,
                    sell_id = 0,
                    product_id = 0,
                    quantity = 0,
                    tax_percent = 0,
                    tax_value = 0
                }) {
        super();
        this._id = id;
        this._sell_id = sell_id;
        this._product_id = product_id;
        this._quantity = quantity;
        this._tax_percent = tax_percent;
        this._tax_value = tax_value;
    }

    get id() {
        return this._id;
    }

    get sell_id() {
        return this._sell_id;
    }

    get product_id() {
        return this._product_id;
    }

    get quantity() {
        return this._quantity;
    }

    get tax_percent() {
        return this._tax_percent;
    }

    get tax_value() {
        return this._tax_value;
    }
}


module.exports = {
    DBModel: DBModel,
    User: User,
    Product: Product,
    Currency: Currency,
    Category: Category,
    Customer: Customer,
    Sell: Sell,
    SellDetails: SellDetails,
}
