import {test} from 'node:test';
import assert from 'node:assert/strict';
import {localRedirect} from '../lib/redirect';
test('authentication redirects stay on the application origin',()=>{
 const origin='https://reviewengine.example';
 for(const path of ['//evil.example','/\\evil.example','https://evil.example','javascript:alert(1)']) assert.equal(localRedirect(path,origin),'/');
 assert.equal(localRedirect('/product/chatgpt?tab=reviews#rate',origin),'/product/chatgpt?tab=reviews#rate');
});
