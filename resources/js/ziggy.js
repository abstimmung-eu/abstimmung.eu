const Ziggy = {"url":"http:\/\/localhost","port":null,"defaults":{},"routes":{"sanctum.csrf-cookie":{"uri":"sanctum\/csrf-cookie","methods":["GET","HEAD"]},"api.votes.import":{"uri":"api\/votes\/import","methods":["POST"]},"index":{"uri":"\/","methods":["GET","HEAD"]},"votes":{"uri":"votes","methods":["GET","HEAD"]},"vote.show":{"uri":"votes\/{vote}","methods":["GET","HEAD"],"parameters":["vote"],"bindings":{"vote":"id"}},"vote.cast":{"uri":"votes\/cast","methods":["POST"]},"about":{"uri":"about","methods":["GET","HEAD"]},"impressum":{"uri":"impressum","methods":["GET","HEAD"]},"datenschutz":{"uri":"datenschutz","methods":["GET","HEAD"]},"comments.store":{"uri":"votes\/{vote}\/comments","methods":["POST"],"parameters":["vote"],"bindings":{"vote":"id"}},"comments.destroy":{"uri":"comments\/{comment}","methods":["DELETE"],"parameters":["comment"],"bindings":{"comment":"id"}},"profile.edit":{"uri":"settings\/profile","methods":["GET","HEAD"]},"profile.update":{"uri":"settings\/profile","methods":["PATCH"]},"profile.destroy":{"uri":"settings\/profile","methods":["DELETE"]},"password.edit":{"uri":"settings\/password","methods":["GET","HEAD"]},"password.update":{"uri":"settings\/password","methods":["PUT"]},"demographics.edit":{"uri":"settings\/demographics","methods":["GET","HEAD"]},"demographics.update":{"uri":"settings\/demographics","methods":["PATCH"]},"appearance":{"uri":"settings\/appearance","methods":["GET","HEAD"]},"register":{"uri":"register","methods":["GET","HEAD"]},"login":{"uri":"login","methods":["GET","HEAD"]},"password.request":{"uri":"forgot-password","methods":["GET","HEAD"]},"password.email":{"uri":"forgot-password","methods":["POST"]},"password.reset":{"uri":"reset-password\/{token}","methods":["GET","HEAD"],"parameters":["token"]},"password.store":{"uri":"reset-password","methods":["POST"]},"verification.notice":{"uri":"verify","methods":["GET","HEAD"]},"verification.email.send":{"uri":"email\/verification-notification","methods":["POST"]},"verification.email.verify":{"uri":"verify-email","methods":["POST"]},"verification.phone.send":{"uri":"phone\/verification-notification","methods":["POST"]},"verification.phone.verify":{"uri":"verify-phone","methods":["POST"]},"password.confirm":{"uri":"confirm-password","methods":["GET","HEAD"]},"logout":{"uri":"logout","methods":["POST"]},"storage.local":{"uri":"storage\/{path}","methods":["GET","HEAD"],"wheres":{"path":".*"},"parameters":["path"]}}};
if (typeof window !== 'undefined' && typeof window.Ziggy !== 'undefined') {
  Object.assign(Ziggy.routes, window.Ziggy.routes);
}
export { Ziggy };
