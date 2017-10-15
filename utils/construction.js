const enterMaintenanceMode = (app) => {
  app.use((req, res, next) => { 
    res.render('construction.hbs');
  })  
}

module.exports = enterMaintenanceMode;