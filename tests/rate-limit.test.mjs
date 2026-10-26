import test from 'node:test';
import assert from 'node:assert/strict';
import {enforceEditorLimit,editorActorKey} from '../src/lib/portal/rate-limit.ts';

test('editor limits reject excess requests and fail closed when the service is unavailable',async()=>{
  let calls=0;
  const limiter={limit:async()=>({success:++calls<=2})};
  await enforceEditorLimit(limiter,'actor');await enforceEditorLimit(limiter,'actor');
  await assert.rejects(enforceEditorLimit(limiter,'actor'),error=>error.status===429&&error.headers.get('Retry-After')==='60');
  await assert.rejects(enforceEditorLimit(undefined,'actor'),error=>error.status===503);
  await assert.rejects(enforceEditorLimit({limit:async()=>{throw Error('offline');}},'actor'),error=>error.status===503);
});
test('rate-limit keys separate request and write budgets without retaining raw addresses or user IDs',async()=>{
  const ip=await editorActorKey('ip','192.0.2.1'),user=await editorActorKey('user','192.0.2.1');
  assert.notEqual(ip,user);assert(!ip.includes('192.0.2.1'));assert.equal(ip,await editorActorKey('ip','192.0.2.1'));
});
