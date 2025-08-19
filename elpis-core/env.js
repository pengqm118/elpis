module.exports = () => {
    const getENV = () => process.env._ENV.replace(/'/g, '').replace(/\s/g, '');
    return {
        isLocal() {
            return getENV() === 'local';
        },
        isBelta() {
            return getENV() === 'belta';
        },
        isProduction() {
            return getENV() === 'production';
        },
        get() {
            return getENV() ?? 'local';
        }
    };
};