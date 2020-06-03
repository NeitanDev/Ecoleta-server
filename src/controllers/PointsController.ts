import { Response, Request } from 'express';
import knex from '../database/connection';

class PointsController {
    async index(req: Request, res: Response) {
        const { city, uf, items } = req.query;

        const parsedItems = String(items).split(',').map(item => Number(item.trim()));

        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');
            //item_id
        return res.json(points);
    }

    async show(req: Request, res: Response) {
        const { id } = req.params;

        const point = await knex('points').where('id', id).first();

        if (!point) {
            return res.status(400).json({ message: 'Point not found' });
        } else if (point) {

            const items = await knex('items')
                .join('point_items', 'items.id', '=', 'point_items.item_id')
                .where('point_items.point_id', id)
                .select('items.title');

            return res.json({ point, items });
        }
    }

    async create(req: Request, res: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items,
        } = req.body;

        const trx = await knex.transaction();

        const point = {
            image: 'https://digital.fispaltecnologia.com.br/sites/fispaltecnologia.com/files/styles/article_featured_retina/public/uploads/2017/06/tendencias-mercado-embalagens-fispal-tecnologia.jpg?itok=NLGdgWWZ',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
        };

        const insertedIds = await trx('points').insert(point);

        const point_id = insertedIds[0];

        const pointItems = items.map((item_id: Number) => {
            return {
                item_id,
                point_id,
            }
        });

        await trx('point_items').insert(pointItems);

        await trx.commit();

        return res.json({
            id: point_id,
            ...point,
        });
    }

    async destroy(req: Request, res: Response) {
        const { id } = req.params;

        await knex('points').where('id', id).delete();
        await knex('point_items').where('point_id', id).delete();

        return res.json({ deleted: true });
    }
}

export default PointsController;