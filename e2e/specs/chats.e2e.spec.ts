describe('Leaderboards', () => {
  let jwt: string;

  beforeAll(async () => {
    const user = {
      email: 'dimasbagussusilo@gmail.com',
      password: 'Password123!!!',
    };
    await fetch('http://auth:3001/users', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const response = await fetch('http://auth:3001/auth/login', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    jwt = await response.text();
  });

  test('Create & Get', async () => {
    const createdLeaderboard = await createLeaderboard();
    const responseGet = await fetch(
      `http://leaderboards:3000/leaderboards/${createdLeaderboard._id}`,
      {
        headers: {
          Authentication: jwt,
        },
      },
    );
    const leaderboard = await responseGet.json();
    expect(createdLeaderboard).toEqual(leaderboard);
  });

  const createLeaderboard = async () => {
    const responseCreate = await fetch(
      'http://leaderboards:3000/leaderboards',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authentication: jwt,
        },
        body: JSON.stringify({
          startDate: '02-01-2023',
          endDate: '02-05-2023',
          placeId: '123',
          invoiceId: '123',
          charge: {
            amount: 13,
            card: {
              cvc: '413',
              exp_month: 12,
              exp_year: 2027,
              number: '4242 4242 4242 4242',
            },
          },
        }),
      },
    );
    expect(responseCreate.ok).toBeTruthy();
    return responseCreate.json();
  };
});
