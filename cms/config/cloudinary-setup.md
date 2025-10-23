# Cloudinary Setup для Strapi

## Встановлення
```bash
yarn add @strapi/provider-upload-cloudinary
```

## Конфігурація в config/plugins.ts
```javascript
module.exports = {
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_KEY,
        api_secret: process.env.CLOUDINARY_SECRET,
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
};
```

## Змінні середовища
```
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret
```

Це вирішить проблему з локальними файлами на Windows.
