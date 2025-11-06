import { apiFetch, API_BASE_URL } from '../client';
import { listDevices, createDevice, getDevice, updateDevice, deleteDevice } from '../devices';

beforeEach(() => {
  jest.restoreAllMocks();
  jest.resetAllMocks();
});

describe('apiFetch', () => {
  test('successful JSON response', async () => {
    const payload = [{ name: 'r1', ip_address: '10.0.0.1', type: 'Router', location: 'A' }];
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify(payload),
    });
    const res = await apiFetch('/devices', { method: 'GET' });
    expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/devices`, expect.any(Object));
    expect(res).toEqual(payload);
  });

  test('non-2xx returns parsed error', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 400,
      text: async () => JSON.stringify({ error: 'Bad input' }),
    });
    await expect(apiFetch('/devices', { method: 'POST', body: '{}' })).rejects.toMatchObject({
      message: 'Bad input',
      status: 400,
      data: { error: 'Bad input' },
    });
  });

  test('network error is thrown', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValue(new Error('boom'));
    await expect(apiFetch('/devices', { method: 'GET' })).rejects.toMatchObject({
      message: 'Network error',
    });
  });
});

describe('devices API wrappers', () => {
  test('listDevices returns array', async () => {
    const data = [{ name: 's1', ip_address: '10.0.0.2', type: 'Server', location: 'B' }];
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify(data),
    });
    await expect(listDevices()).resolves.toEqual(data);
  });

  test('createDevice passes payload', async () => {
    const payload = { name: 'n1', ip_address: '10.0.0.3', type: 'Switch', location: 'C' };
    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify(payload),
    });
    await createDevice(payload);
    const [, options] = fetchSpy.mock.calls[0];
    expect(options.method).toBe('POST');
    expect(options.body).toBe(JSON.stringify(payload));
  });

  test('getDevice builds url', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({ name: 'r1' }),
    });
    await getDevice('r 1');
    expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/devices/r%201`, expect.any(Object));
  });

  test('updateDevice uses PUT', async () => {
    const payload = { ip_address: '10.0.0.5', type: 'Router', location: 'D' };
    const spy = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({}),
    });
    await updateDevice('x', payload);
    expect(spy).toHaveBeenCalledWith(`${API_BASE_URL}/devices/x`, expect.objectContaining({ method: 'PUT' }));
  });

  test('deleteDevice returns true when 204/200 ok', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      status: 204,
      text: async () => '',
    });
    await expect(deleteDevice('x')).resolves.toBe(true);
  });

  test('deleteDevice throws on error', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 404,
      text: async () => JSON.stringify({ error: 'Not found' }),
    });
    await expect(deleteDevice('x')).rejects.toMatchObject({ status: 404, message: 'Not found' });
  });
});
