const {User, SellDetails, Customer, Category, Currency, Product, Sell, DBModel} = require("./model")

const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const { autoUpdater } = require('electron-updater');
const baseUrl = "http://localhost:3000/index.html";
//const baseUrl = `file://${path.join(__dirname, '../build/index.html')}`;

const dbConfig = {
    user: '',
    pass: '',
    name: '',
    host: ''
};

function init() {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        },
        show: false,
    })
    win.setMenuBarVisibility(false)
    win.loadURL(baseUrl)

    win.once('ready-to-show', () => {
        updateDbCredentials().finally( () => {
            win.show();
            autoUpdater.checkForUpdatesAndNotify();
        })
    });

    setInterval( () => {autoUpdater.checkForUpdatesAndNotify()}, 600000);

    autoUpdater.on('update-available', () => {
        win.webContents.send('update_available');
    });
    autoUpdater.on('update-downloaded', () => {
        win.webContents.send('update_downloaded');
    });

    ipcMain.on('restart_app', () => {
        autoUpdater.quitAndInstall();
    });

    ipcMain.on('app_version', (event) => {
        event.sender.send('app_version', { version: app.getVersion() });
    });


    const updateDbCredentials = async () => {
        dbConfig.host = await getStorage('dbHost')
        dbConfig.user = await getStorage('dbUser')
        dbConfig.pass = await getStorage('dbPass')
        dbConfig.name = await getStorage('dbName')
    }

    const getStorage = (key) => {
        return new Promise((resolve,reject) => {
            win.webContents
                .executeJavaScript(`localStorage.getItem("${key}");`, true)
                .then(result => {
                    resolve(result)
                })
                .catch( err => {
                    reject(err)
                })
        })

    }

    ipcMain.on('update-database', updateDbCredentials)

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
            let db = new DBModel({dbConfig: dbConfig});
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
            const product = new Product({dbConfig: dbConfig});
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
            const category = new Category({dbConfig: dbConfig});
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
            const producto = new Product({dbConfig: dbConfig});
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


    const listenerGetProduct = (event,arg) => {

        return new Promise((resolve,reject) => {
            const producto = new Product({dbConfig: dbConfig});
            producto.get(arg.id)
                .then((response) => {
                    resolve({status: 'success', data: response})
                    //win.webContents.send('get-product')
                })
                .catch((err) => {
                    reject({status: 'error', data: err})
                })
        })
    }
    ipcMain.handle('get-producto', listenerGetProduct);

    const listenerUpdateProduct = (event,arg) => {

        return new Promise((resolve,reject) => {
            const producto = new Product({dbConfig: dbConfig});
            producto.update(arg)
                .then((response) => {
                    resolve({status: 'success', data: response})
                    win.webContents.send('new-product-created')
                })
                .catch((err) => {
                    reject({status: 'error', data: err})
                })
        })
    }
    ipcMain.handle('update-producto', listenerUpdateProduct);

    const listenerDeleteProducto = (event,arg) => {

        return new Promise((resolve,reject) => {
            const producto = new Product({dbConfig: dbConfig});
            producto.remove(arg.id)
                .then((response) => {
                    resolve({status: 'success', data: response})
                    win.webContents.send('new-product-created')
                })
                .catch((err) => {
                    reject({status: 'error', data: err})
                })
        })
    }
    ipcMain.handle('delete-producto', listenerDeleteProducto);

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


        window.loadURL(baseUrl + "#" +route)
        window.removeMenu();
        //window.webContents.openDevTools()
        window.once("ready-to-show", () => {
            window.show()
        })
    };
    ipcMain.on("new-window", listenerNewWindow);
    //ipcMain.removeListener("new-window", listenerNewWindow)
}

// and load the index.html of the app.     win.loadFile('index.html')   }      
app.on('ready', init)

