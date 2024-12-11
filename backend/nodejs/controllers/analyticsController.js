export const analyticsController = {
    async getDashboardMetrics(request, response) {
        const db = request.db;
        const { boothId } = request.params;

        try {
            const [metrics] = await db.query(`
                SELECT
                    (SELECT COUNT(*) FROM \`order\` WHERE BoothID = ? AND Status = 'Complete') as total_sales,
                    (SELECT SUM(Price) FROM \`order\` WHERE BoothID = ? AND Status = 'Complete') as total_earnings,
                    (SELECT COUNT(DISTINCT OrderID) FROM \`order\` WHERE BoothID = ? AND DateOrdered >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY)) as weekly_orders,
                    (SELECT COUNT(*) FROM \`order\` WHERE BoothID = ? AND Status = 'Pending') as pending_orders
                FROM dual
            `, [boothId, boothId, boothId, boothId]);

            response.json(metrics[0]);
        } catch (error) {
            console.error('Error fetching dashboard metrics:', error);
            response.status(500).send('Failed to fetch dashboard metrics');
        }
    },


    async getSalesTrends(request, response) {
        const db = request.db;
        const { boothId } = request.params;
        const { timeframe = 'week' } = request.query;

        try {
            const [trends] = await db.query(`
                SELECT 
                    DATE(DateOrdered) as date,
                    COUNT(*) as order_count,
                    SUM(Price) as daily_revenue,
                    COUNT(CASE WHEN Status = 'Complete' THEN 1 END) as completed_orders
                FROM \`order\`
                WHERE BoothID = ?
                AND DateOrdered >= DATE_SUB(CURRENT_DATE, INTERVAL 1 ${timeframe})
                GROUP BY DATE(DateOrdered)
                ORDER BY date ASC
            `, [boothId]);

            response.json(trends);
        } catch (error) {
            console.error('Error fetching sales trends:', error);
            response.status(500).send('Failed to fetch sales trends');
        }
    },

    // Get product performance
    async getProductPerformance(request, response) {
        const db = request.db;
        const { boothId } = request.params;

        try {
            const [products] = await db.query(`
                SELECT 
                    p.name,
                    p.StocksRemaining,
                    COUNT(op.OrderID) as times_ordered,
                    SUM(op.Quantity) as units_sold,
                    SUM(op.Total) as total_revenue
                FROM product p
                LEFT JOIN order_products op ON p.ProductID = op.ProductID
                LEFT JOIN \`order\` o ON op.OrderID = o.OrderID
                WHERE p.BoothID = ? AND o.Status = 'Complete'
                GROUP BY p.ProductID
                ORDER BY total_revenue DESC
            `, [boothId]);

            response.json(products);
        } catch (error) {
            console.error('Error fetching product performance:', error);
            response.status(500).send('Failed to fetch product performance');
        }
    },


    async getInventoryStatus(request, response) {
        const db = request.db;
        const { boothId } = request.params;

        try {
            const [inventory] = await db.query(`
                SELECT 
                    p.ProductID,
                    p.name,
                    p.StocksRemaining,
                    COUNT(i.InventoryID) as stock_movements,
                    SUM(CASE WHEN i.Type = 'in' THEN i.Quantity ELSE -i.Quantity END) as net_stock_change
                FROM product p
                LEFT JOIN inventory i ON p.ProductID = i.ProductID
                WHERE p.BoothID = ?
                GROUP BY p.ProductID
                ORDER BY p.StocksRemaining ASC
            `, [boothId]);

            response.json(inventory);
        } catch (error) {
            console.error('Error fetching inventory status:', error);
            response.status(500).send('Failed to fetch inventory status');
        }
    }
};