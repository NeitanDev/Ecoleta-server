import knex from '../database/connection';

module.exports = {
    async listItem(req: Request, res: Response) {
        const items = await knex('items').select('*');

        const serializedItems = items.map(item => {
            return {
                id: Number(item.id),
                title: String(item.title),
                image_url: `http://localhost:3333/uploads/${item.image}`,
            };
        })

        // return res.json(serializedItems);
    },
}