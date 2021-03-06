import {
  hasPermissions,
  loadPermissions,
  loosePermissions,
} from '../allPermissions';

describe('allPermissions', () => {
  it('loads permissions', async () => {
    const getUserPermissionsSpy = jest
      .spyOn(window.insights.chrome, 'getUserPermissions')
      .mockImplementationOnce(() => Promise.reject())
      .mockImplementationOnce(() => Promise.reject())
      .mockImplementationOnce(() =>
        Promise.resolve([
          { permission: 'cost:*:*' },
          { permission: 'sources:*:*' },
        ])
      );

    await loadPermissions();

    expect(getUserPermissionsSpy.mock.calls.length).toEqual(3);

    expect(hasPermissions(['cost:*:*'])).toEqual(true);
    expect(hasPermissions(['sources:*:*'])).toEqual(true);
    expect(hasPermissions(['cost:*:*', 'sources:*:*'])).toEqual(true);
    expect(hasPermissions(['cost:*:*', 'subwatch:*:*'])).toEqual(false);
    expect(hasPermissions([])).toEqual(true);

    getUserPermissionsSpy.mockRestore();
  });

  it('fails 5x and no permissions', async () => {
    const getUserPermissionsSpy = jest
      .spyOn(window.insights.chrome, 'getUserPermissions')
      .mockImplementation(() => Promise.reject());

    await loadPermissions();

    expect(getUserPermissionsSpy.mock.calls.length).toEqual(5);

    expect(hasPermissions(['cost:*:*'])).toEqual(false);
    expect(hasPermissions(['sources:*:*'])).toEqual(false);
    expect(hasPermissions(['cost:*:*', 'sources:*:*'])).toEqual(false);
    expect(hasPermissions(['cost:*:*', 'subwatch:*:*'])).toEqual(false);
    expect(hasPermissions([])).toEqual(true);

    getUserPermissionsSpy.mockRestore();
  });

  it('loose permissions', async () => {
    const getUserPermissionsSpy = jest
      .spyOn(window.insights.chrome, 'getUserPermissions')
      .mockImplementationOnce(() =>
        Promise.resolve([
          { permission: 'cost:*:*' },
          { permission: 'sources:*:*' },
        ])
      );

    await loadPermissions();

    expect(loosePermissions(['cost:*:*'])).toEqual(true);
    expect(loosePermissions(['sources:*:*'])).toEqual(true);
    expect(loosePermissions(['cost:*:*', 'sources:*:*'])).toEqual(true);
    expect(loosePermissions(['cost:*:*', 'subwatch:*:*'])).toEqual(true);
    expect(loosePermissions(['topo:*:*', 'subwatch:*:*'])).toEqual(false);
    expect(loosePermissions([])).toEqual(true);

    getUserPermissionsSpy.mockRestore();
  });
});
