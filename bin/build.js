var dirname = require('path').dirname,
    psc = require('purescript').psc,
    spawn = require('child_process').spawn;

var PATH = process.env.PATH + ':' + dirname(psc),
    cmd,
    args;

if(process.argv[2] === 'dev') {
    cmd = './node_modules/.bin/webpack-dev-server';
    args = ['--content-base', 'assets/', '--hot', '--config', 'webpack-development.config.js'];
} else {
    cmd = './node_modules/.bin/webpack';
    args = ['--config', 'webpack-production.config.js'];
}

spawn(cmd, args, {
    stdio: 'inherit',
    env: {
        PATH: PATH
    }
});
