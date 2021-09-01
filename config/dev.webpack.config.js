const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');

const insightsProxy = {
    https: false,
    ...(process.env.BETA && { deployment: 'beta/apps' })
};

const webpackProxy = {
    deployment: process.env.BETA ? 'beta/apps' : 'apps',
    useProxy: true,
    useCloud: true,
    appUrl: process.env.BETA ? ['/beta/internal/commit-tracker'] : ['/internal/commit-tracker'],
    env: 'qa-beta'
};

const { config: webpackConfig, plugins } = config({
    rootFolder: resolve(__dirname, '../'),
    debug: true,
    sassPrefix: '.commit-tracker, .commitTracker',
    ...(process.env.PROXY ? webpackProxy : insightsProxy)
});

plugins.push(
    require('@redhat-cloud-services/frontend-components-config/federated-modules')({
        root: resolve(__dirname, '../')
    })
);

module.exports = () => {
    return { ...webpackConfig, plugins };
};
