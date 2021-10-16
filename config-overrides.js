/* const {override, fixBabelImports} = require('customize-cra');
module.exports = override(
    //针对antd实现按需打包：格局import来打包(使用babel-plugin-import)
    fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css',   //自动打包相关的样式
    }),
); */

const {override, fixBabelImports, addLessLoader} = require('customize-cra');
module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
    }),
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: {'@primary-color': '#1DA57A'},
    }),
);