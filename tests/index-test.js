const Redis = require('../index');

let client = new Redis({
    port: 6379,
    host: '127.0.0.1'
})

const MOCK = [
    'joe.5.shape1',
    'joe.23.shape2',
    'doe.0.shape3',
    'doe.3.shape3',
    'poe.10.shape4',
    'poe.12.shape5'
]

function mock(client) {
    client.connection = {}
    client.connection.smembers = (_, fn) => fn(null, MOCK)

    return client
}

describe('Redis', () => {
    it('should fail on real connect', async () => {
        try {
            client.connect()
        } catch(error) {
            expect(error instanceof Error).toBe(true)
        }
    });

    describe('methods', () => {
        beforeAll(() => {
            mock(client)
        });

        it('smembers', async () => { 
            const data = await client.call('smembers', '');
            expect(data).toEqual(MOCK);
        });

        it('smembers', async () => { 
            const data = await client.call('smembers', '').map(x => x.split('.'))
            expect(data).toEqual(MOCK.map(x => x.split('.')));
        });

        it('sort', async () => { 
            const data = await client
                .call('smembers', '')
                .map(x => x.split('.'))
                .map(([name, n, shape]) => ({name, id: Number(n), shape}))
                .sort('id')
                .map(x => x.id)

            expect(data).toEqual([0, 3, 5, 10, 12, 23]);
        });

        it('orderBy', async () => { 
            const data = await client
                .call('smembers', '')
                .map(x => x.split('.'))
                .map(([name, n, shape]) => ({name, id: Number(n), shape}))
                .sort('id')
                .map(x => x.id)

            expect(data).toEqual([0, 3, 5, 10, 12, 23]);
        });

        it('asc', async () => { 
            const data = await client
                .call('smembers', '')
                .map(x => x.split('.'))
                .map(([name, n, shape]) => ({name, id: Number(n), shape}))
                .asc('id')
                .map(x => x.id)

            expect(data).toEqual([0, 3, 5, 10, 12, 23]);
        });

        it('desc', async () => { 
            const data = await client
                .call('smembers', '')
                .map(x => x.split('.'))
                .map(([name, n, shape]) => ({name, id: Number(n), shape}))
                .desc('id')
                .map(x => x.id)

            expect(data).toEqual([0, 3, 5, 10, 12, 23].reverse());
        });
    })
});