const path = require('path');

module.exports = {
    mode: 'production', // Set to 'development' for easier debugging
    entry: './src/extension.ts', // Your entry file
    output: {
        filename: 'extension.js', // The name of the output file
        path: path.resolve(__dirname, 'out'), // Output directory
        libraryTarget: 'commonjs2', // Required for VSCode extensions
    },
    resolve: {
        extensions: ['.ts', '.js'], // Resolve these extensions
    },
    module: {
        rules: [
            {
                test: /\.ts$/, // Apply this rule to .ts files
                use: 'ts-loader', // Use ts-loader to transpile TypeScript
                exclude: /node_modules/, // Exclude node_modules
            },
        ],
    },
    externals: {
        vscode: 'commonjs vscode', // Exclude the vscode module from the bundle
    },
    devtool: 'source-map', // Enable source maps for debugging
};
