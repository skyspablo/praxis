class DBModel {

    _db;
    _md5 = require('md5');

    constructor(
        {
            dbConfig,
        }) {
        this._dbConfig = dbConfig;
        this.init();
    }

    init(){
        this._db = require('knex')({
            client: 'mysql',
            connection: {
                host: this._dbConfig.host,
                user: this._dbConfig.user,
                password: this._dbConfig.pass,
                database: this._dbConfig.name
            }
        });
    }

    async login(username, password) {
        return new Promise((resolve, reject) => {
            //console.log(this._dbConfig)
            const mysql = new MySQL({dbConfig:this._dbConfig});
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
    _conn;

    constructor(
        {
            dbConfig = {},
        }) {
        this._dbConfig = dbConfig;
        this.init();
    }

    init(){
        this._conn = this._mysql.createConnection({
            host: this._dbConfig.host,
            user: this._dbConfig.user,
            password: this._dbConfig.pass,
            database: this._dbConfig.name
        });
    }

    async query(query, params = []) {
        return new Promise((resolve, reject) => {
            this._conn.connect();

            if(params.length > 0){
                this._conn.query(query, params, function (error, results, fields) {
                    if (error) {
                        reject(error)
                    } else {
                        resolve(results)
                    }
                });
            }else{
                this._conn.query(query, function (error, results, fields) {
                    if (error) {
                        reject(error)
                    } else {
                        resolve(results)
                    }
                });
            }

            this._conn.end();
        })
    }

    async listTable({sql, page = 1, limit = 10}) {
        return new Promise((resolve, reject) => {
            this._conn.connect();
            this._conn.query(sql, (error, results, fields) => {
                if (error) {
                    reject(error)
                } else {
                    let finalData = results;

                    finalData = finalData.slice((page - 1) * limit, limit * (page));
                    const lastPage = Math.ceil(results.length / limit)
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
            dbConfig = {},
        }) {
        super({dbConfig:dbConfig});
        this._dbConfig = dbConfig;
    }


}

class Product extends DBModel {

    constructor(
        {
            dbConfig = {},
        }) {
        super({dbConfig:dbConfig});
        this._dbConfig = dbConfig;
    }

    async listTable({page = 1, limit = 10, search = ''}) {
        return new Promise((resolve, reject) => {
            let sql;
            if (search === "") {
                sql = 'SELECT * FROM products order by id desc';
            } else {
                sql = `SELECT * FROM products WHERE (name like '%${search}%' or id like '%${search}%' or sku like '%${search}%') order by id desc`;
            }

            const mysql = new MySQL({dbConfig:this._dbConfig});
            mysql.listTable({sql: sql, page: page, limit: limit})
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

            const mysql = new MySQL({dbConfig:this._dbConfig});

            mysql.query(sql)
                .then((r) => {
                    resolve(r)
                })
                .catch((err) => reject(err));

        });
    }

    async create(productData) {

        return new Promise((resolve, reject) => {
            const mysql = new MySQL({dbConfig:this._dbConfig});
            mysql.query(`
                    INSERT INTO products (sku, existence, category_id, currency_id, name, price, active, created) 
                    VALUES ('${productData.sku}', '${productData.existence}', '${productData.category_id}', 1, '${productData.name}', '${productData.price}', 1, NOW() )`)
                .then((r) => {
                    resolve(r)
                })
                .catch((err) => reject(err));
        });
    }

    async update(productData) {

        return new Promise((resolve, reject) => {
            const mysql = new MySQL({dbConfig:this._dbConfig});
            mysql.query(`UPDATE products SET  name = ?, sku = ?, existence = ?, price = ?, category_id = ? WHERE id = ?`,
                [productData.name, productData.sku, productData.existence, productData.price, productData.category_id, productData.id])
                .then((r) => {
                    resolve(r)
                })
                .catch((err) => reject(err));
        });
    }

    async get(id) {

        return new Promise((resolve, reject) => {
            const mysql = new MySQL({dbConfig:this._dbConfig});
            mysql.query(`SELECT * FROM products WHERE id = ?`, [id])
                .then((r) => {
                    resolve(r)
                })
                .catch((err) => reject(err));
        });
    }

    async remove(id) {

        return new Promise((resolve, reject) => {
            const mysql = new MySQL({dbConfig:this._dbConfig});
            mysql.query(`DELETE from products WHERE id = ?`, [id])
                .then((r) => {
                    resolve(r)
                })
                .catch((err) => reject(err));
        });
    }


}

class Category extends DBModel {

    constructor(
        {
            dbConfig = {},
        }) {
        super({dbConfig:dbConfig});
        this._dbConfig = dbConfig;
    }

    async listAll() {

        return new Promise((resolve, reject) => {
            let sql = 'SELECT * FROM categories ';
            const mysql = new MySQL({dbConfig:this._dbConfig});
            mysql.query(sql)
                .then((r) => {
                    resolve(r)
                })
                .catch((err) => reject(err));
        });
    }


}

class Currency extends DBModel {
    constructor(
        {
            dbConfig = {},
        }) {
        super({dbConfig:dbConfig});
        this._dbConfig = dbConfig;
    }


}

class Customer extends DBModel {
    constructor(
        {
            dbConfig = {},
        }) {
        super({dbConfig:dbConfig});
        this._dbConfig = dbConfig;
    }


}

class Sell extends DBModel {
    constructor(
        {
            dbConfig = {},
        }) {
        super({dbConfig:dbConfig});
        this._dbConfig = dbConfig;
    }


}

class SellDetails extends DBModel {
    constructor(
        {
            dbConfig = {},
        }) {
        super({dbConfig:dbConfig});
        this._dbConfig = dbConfig;
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
