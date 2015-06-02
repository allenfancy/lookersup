module.exports = function ( app ) {
    require('./login')(app);
    require('./logout')(app);
    require('./register')(app);
    require('./home')(app);
};