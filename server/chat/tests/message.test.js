const expect = require('expect');
const {generateMessage, generateLocationMessage} = require('../utils/message');

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

describe('generate location message', () => {
  it('should generate correct location message', () => {
    var from = 'admin';
    var latitude = 15;
    var longitude = 19;
    var msg = generateLocationMessage(from, latitude, longitude);
    expect(msg.from).toBe(from);
    expect(msg.url).toBe('https://www.google.com/maps?q=15,19')
    expect(typeof msg.createdAt).toBe('number');
    expect(msg.createdAt).toBeGreaterThan(0);    
  })
})