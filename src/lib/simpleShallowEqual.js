export default (v, o) => {
  for (var vKey in v)
    if (!(vKey in o) || v[vKey] !== o[vKey])
      return false

  for (var oKey in o)
    if (!(oKey in v) || v[oKey] !== o[oKey])
      return false

  return true
}

