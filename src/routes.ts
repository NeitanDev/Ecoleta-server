import express from 'express';
import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';

const routes = express.Router();
const pointsController = new PointsController();
const itemsController = new ItemsController();

routes.get('/items', itemsController.listItem);

routes.post('/points', pointsController.create);

export default routes;

// index: para listar todos os itens,
// show: um unico item
// create/store: criar
// update: alterar
// delete/destroy: deletar