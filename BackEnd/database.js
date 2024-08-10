const mysql = require('mysql'); 

module.exports = {
  con: mysql.createConnection({     
    host: 'remotemysql.com',        
    user: 'BU0SSpz9lq',         
    password: 'E8bz70O3Az',       
    database: 'BU0SSpz9lq',        
    port: 3306
  }) 
};