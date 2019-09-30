{
    appDir: '../js',
    mainConfigFile: '../js/commonConfig.js',
    dir: '../build',
    modules: [
        {
            name: './commonConfig',
            include: ['jquery']
        },
        {
            name: './font_product/fontProductDetail',
            exclude: ['./commonConfig']
        },
        {
            name: './font_product/fontProductIndex',
            exclude: ['./commonConfig']
        },
        {
            name: './font_product/fontProductPayResult',
            exclude: ['./commonConfig']
        },
        {
            name: './font_product/fontProductInfo',
            exclude: ['./commonConfig']
        },
        {
            name: './font_product/fontProductPay',
            exclude: ['./commonConfig']
        }
    ]
}

