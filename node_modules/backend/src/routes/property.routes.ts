import { Router } from 'express';
import { createPropertyHandler, getPropertiesHandler, getPropertyAvailabilityHandler } from './property.controller';

const propertyRoutes = Router();

propertyRoutes.post('/', createPropertyHandler);
propertyRoutes.get('/', getPropertiesHandler);
propertyRoutes.get('/:id/availability', getPropertyAvailabilityHandler)

export { propertyRoutes };