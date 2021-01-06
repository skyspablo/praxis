const {User, SellDetails, Customer, Category, Currency, Product, Sell, DBModel} = require("./model")

const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')

//const baseUrl = "http://localhost:3000/";
const baseUrl = `file://${path.join(__dirname, '../build/index.html')}`;

function init() {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.setMenuBarVisibility(false)
    win.loadURL(baseUrl)


    const listenerResize = (event, {width, height}) => {
        if (!win.isFullScreen()) {
            const bounds = win.getBounds();
            const equal_size = bounds.height === height && bounds.width === width;
            win.setSize(width, height);
            if (!equal_size) {
                //win.center();
            }
        }
    };
    ipcMain.on("resize", listenerResize)
    //ipcMain.removeListener("resize", listenerResize)

    const listenerLoginUser = (event, arg) => {
        return new Promise((resolve,reject) => {
            let db = new DBModel();
            let data = db.login(arg.username, arg.password);
            const loggedUser = {id: 0, name: ""}

            data.then((response) => {
                if (response.length === 1) {
                    loggedUser.id = response[0].id;
                    loggedUser.name = response[0].username;
                    resolve({status: 'success', user: loggedUser})
                } else {
                    resolve({status: 'error', msg: 'Usuario ingresado no es válido'})
                }
            }).catch((err) => {
                reject({status: 'error', msg: err})
            })
        });
    };
    ipcMain.handle('login-user', listenerLoginUser);
    //ipcMain.removeListener('login-user', listenerLoginUser);

    const listenerGetProductos = (event, arg) => {
        return new Promise((resolve,reject) => {
            const product = new Product({});
            product.listTable(arg)
                .then((response) => {
                    resolve({status: 'success', data: response})
                })
                .catch((err) => {
                    reject({status: 'error', data: err})
                })
        })
    };
    ipcMain.handle('get-productos',listenerGetProductos );
    //ipcMain.removeListener('get-productos',listenerGetProductos );

    const listenerGetCategorias = (event, arg) => {
        return new Promise((resolve,reject) => {
            const category = new Category({});
            category.listAll()
                .then((response) => {
                    resolve({status: 'success', data: response})
                })
                .catch((err) => {
                    reject({status: 'error', data: err})
                })
        })
    };
    ipcMain.handle('get-categorias', listenerGetCategorias);
    //ipcMain.removeListener('get-categorias',listenerGetCategorias)

    const listenerCreateProduct = (event,arg) => {

        return new Promise((resolve,reject) => {
            const producto = new Product({});
            producto.create(arg)
                .then((response) => {
                    resolve({status: 'success', data: response})
                    win.webContents.send('new-product-created')
                })
                .catch((err) => {
                    reject({status: 'error', data: err})
                })
        })
    }
    ipcMain.handle('crear-producto',listenerCreateProduct);
    //ipcMain.removeListener('crear-producto', listenerCreateProduct);

    const listenerNewWindow = (event, {route, width = 800, height = 600}) => {
        let window = new BrowserWindow(
            {
                height: height,
                width: width,
                show: false,
                frame: true,
                webPreferences: {
                    nodeIntegration: true
                },
            })
        window.loadURL(baseUrl + route)
        window.removeMenu();
        window.webContents.openDevTools()
        window.once("ready-to-show", () => {
            window.show()
        })
    };
    ipcMain.on("new-window", listenerNewWindow);
    //ipcMain.removeListener("new-window", listenerNewWindow)
}

// and load the index.html of the app.     win.loadFile('index.html')   }      
app.on('ready', init)

