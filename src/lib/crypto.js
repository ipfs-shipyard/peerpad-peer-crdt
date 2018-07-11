import OAEP from './oaep'

class Crypto {
  constructor(readKey, writeKey) {
    this.readKey = readKey
    this.writeKey = writeKey
    this.textdecoder = new TextDecoder('utf8')
  }

  async decrypt(value) {
    if (typeof value !== 'string') {
      value = this.textdecoder.decode(value)
    }
    let out = await OAEP.decrypt(this.readKey, value)
    out = JSON.parse(out)
    return out
  }

  async encrypt(value) {
    value = JSON.stringify(value)
    const out = await OAEP.encrypt(this.writeKey, value)
    return out
  }
}

export default Crypto
