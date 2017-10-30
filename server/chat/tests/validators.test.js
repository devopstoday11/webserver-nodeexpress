const expect = require('expect');
const {isRealString} = require('../utils/validators');

describe('isRealString', () => {
  it('should reject non-string values', () => {
    expect(isRealString(null)).toBeFalsy();
    expect(isRealString(234)).toBeFalsy();    
  });

  it('should reject string with only spaces', () => {
    expect(isRealString('    ')).toBeFalsy();    
  });

  it('should allow string with non string characters', () => {
    expect(isRealString('lord of the rings')).toBeTruthy();
  });

})