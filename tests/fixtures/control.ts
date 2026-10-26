// LOCAL test double for the service binding; never deploy this worker.
export default {fetch(request: Request) {
  const token=request.headers.get('Authorization');
  const role=token?.replace('Bearer local-test-','');
  if(!['owner','editor','viewer','other-site'].includes(role ?? ''))return new Response('{}',{status:401});
  return Response.json({uid:'local-test-user',email:'test@example.invalid',siteId:role==='other-site'?'hixon':'jaclyn',role:role==='other-site'?'owner':role});
}};
