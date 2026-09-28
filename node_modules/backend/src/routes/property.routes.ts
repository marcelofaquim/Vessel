import { Router } from 'express';
import { createPropertyHandler, getPropertiesHandler, getPropertyAvailabilityHandler, getPropertyByIdHandler } from './property.controller';

const propertyRoutes = Router();

propertyRoutes.post('/', createPropertyHandler);
propertyRoutes.get('/', getPropertiesHandler);
propertyRoutes.get('/:id', getPropertyByIdHandler),
propertyRoutes.get('/:id/availability', getPropertyAvailabilityHandler)

export { propertyRoutes };