import { errors } from '@strapi/utils';

const { ApplicationError } = errors;

export default {
  async beforeCreate(event) {
    const images = event?.params?.data?.images;
    if (Array.isArray(images) && images.length > 4) {
      throw new ApplicationError('You can upload up to 4 images for a product.');
    }
  },

  async beforeUpdate(event) {
    const images = event?.params?.data?.images;
    if (Array.isArray(images) && images.length > 4) {
      throw new ApplicationError('You can upload up to 4 images for a product.');
    }
  },
};



