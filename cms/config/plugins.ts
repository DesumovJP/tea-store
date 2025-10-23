export default {
    graphql: {
        enabled: true,
        config: {
            endpoint: '/graphql',
            shadowCRUD: true,
            playgroundAlways: true,
            depthLimit: 10,
            amountLimit: 100,
        },
    },
    upload: {
        config: {
            // Increase size limit to reduce 500s during image processing (sharp) on larger assets
            sizeLimit: 25 * 1024 * 1024, // 25MB
            // Disable breakpoints for GIF files to prevent processing
            breakpoints: {
                xlarge: 1280,
                large: 960,
                medium: 720,
                small: 480,
                xsmall: 64,
            },
            // Disable image processing completely for GIF files
            imageOptimization: false,
            // Add retry logic for file operations
            retry: {
                max: 3,
                delay: 1000
            }
        },
    },
};