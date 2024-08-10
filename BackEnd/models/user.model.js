module.exports = function(sequelize, Sequelize) {
    let User = sequelize.define('user', {
        id: { autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
        username: { type: Sequelize.STRING, notEmpty: true , primaryKey: true},
        nome: { type: Sequelize.STRING, notEmpty: true },
        email_utilizador: { type: Sequelize.STRING, validate: { isEmail: true } },
        password: { type: Sequelize.STRING, allowNull: false },
        id_cargo: {type: Sequelize.INTEGER, references: { model: 'cargo', key: 'id_cargo' }},
        status: { type: Sequelize.ENUM('active', 'inactive'), defaultValue: 'active' }
    });
    return User;
}