import { Router } from 'express';
import { createPropertyHandler, getPropertiesHandler } from './property.controller';

const propertyRoutes = Router();

propertyRoutes.post('/', createPropertyHandler);
propertyRoutes.get('/', getPropertiesHandler);

export { propertyRoutes };