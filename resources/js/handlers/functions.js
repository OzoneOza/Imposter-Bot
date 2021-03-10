const URL = require('url').URL;

module.exports = {
    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    },
    isURL(s) {
        try {
            new URL(s);
            return true;
        } catch (error) {
            return false;
        }
    }
}