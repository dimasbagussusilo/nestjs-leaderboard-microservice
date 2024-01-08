describe('Health', () => {
  test('Leaderboards', async () => {
    const response = await fetch('http://leaderboards:3000');
    expect(response.ok).toBeTruthy();
  });

  test('Auth', async () => {
    const response = await fetch('http://auth:3001');
    expect(response.ok).toBeTruthy();
  });
});
