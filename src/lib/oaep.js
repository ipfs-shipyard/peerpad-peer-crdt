const Bs58 = require('bs58')

const OAEP = {
  keyCache: new Map(),

  genKey: async function() {
    const key = await crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: { name: 'SHA-256' },
        modulusLength: 1024
      },
      true,
      ['encrypt', 'decrypt']
    )
    const publicRaw = await crypto.subtle.exportKey('spki', key.publicKey)
    const privateRaw = await crypto.subtle.exportKey('pkcs8', key.privateKey)
    const public58 = Bs58.encode(Buffer.from(publicRaw))
    const private58 = Bs58.encode(Buffer.from(privateRaw))
    return { publicKey: public58, privateKey: private58 }
  },

  importPublicKey: async function(key58) {
    if (this.keyCache.has(key58)) {
      return this.keyCache.get(key58)
    }
    const spki = Bs58.decode(key58)
    const key = await crypto.subtle.importKey(
      'spki',
      spki,
      {
        name: 'RSA-OAEP',
        hash: { name: 'SHA-256' }
      },
      true,
      ['encrypt']
    )

    this.keyCache.set(key58, key)
    return key
  },

  importPrivateKey: async function(key58) {
    if (this.keyCache.has(key58)) {
      return this.keyCache.get(key58)
    }
    const pkcs8 = Bs58.decode(key58)
    const key = await crypto.subtle.importKey(
      'pkcs8',
      pkcs8,
      {
        name: 'RSA-OAEP',
        hash: { name: 'SHA-256' }
      },
      true,
      ['decrypt']
    )

    this.keyCache.set(key58, key)
    return key
  },

  encrypt: async function(key58, value) {
    const key = await this.importPublicKey(key58)
    const value8arr = new TextEncoder('utf8').encode(value)
    const enc = await crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      key,
      value8arr
    )
    const out = Bs58.encode(Buffer.from(enc))
    return out
  },

  decrypt: async function(key58, value58) {
    const key = await this.importPrivateKey(key58)
    const value = Bs58.decode(value58)
    const dec = await crypto.subtle.decrypt({ name: 'RSA-OAEP' }, key, value)
    const out = new TextDecoder('utf8').decode(dec)
    return out
  }
}

export default OAEP

/*
(async () => {

  const oaep = module.exports;

  const key58 = await oaep.genKey();
  console.log(`${key58.privateKey}.${key58.publicKey}`);
  const encvalue = await oaep.encrypt(key58.publicKey, 'How are you?');
  console.log(encvalue);
  const decvalue = await oaep.decrypt(key58.privateKey, encvalue);
  console.log(decvalue);
})();
*/
