import createAsyncSelector from '../src/index'

test('Test randomFunction', () => {
  expect(typeof createAsyncSelector === 'function');
});