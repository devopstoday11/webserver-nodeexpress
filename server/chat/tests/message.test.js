const expect = require('expect');
const {generateMessage} = require('../utils/message');

describe('generate message', () => {
  it('should produce a message with correct datetime', () => {
    var from = 'admin';
    var text = 'a message';
    var res = generateMessage(from, text);
    expect(res.from).toBe(from);
    expect(res.text).toBe(text);
    expect(typeof res.createdAt).toBe('number');
    expect(res.createdAt).toBeGreaterThan(0);    
  })
})