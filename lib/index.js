function stringify(val) {
  switch (typeof val) {
    case 'boolean':
      return ':' + Number(val) + '\r\n'
    case 'number':
      return ':' + val + '\r\n'
    case 'string':
      return '$' + val.length + '\r\n' + val + '\r\n'
  }

  if (val == null) {
    return '$-1\r\n'
  }

  if (Array.isArray(val)) {
    return '*' + val.length + '\r\n' + val.map(stringify).join('')
  }

  if (val.message) {
    // TODO(schoon) - Should we assert this is an Error type?
    if (val.name) {
      return '-' + val.name + ' ' + val.message + '\r\n'
    } else {
      return '+' + val.message + '\r\n'
    }
  }

  throw new TypeError('Invalid value: ' + val)
}

function parse(str) {
  var index = 0

  function content() {
    return str.slice(index + 1, str.indexOf('\r\n', index))
  }

  function skip() {
    index = str.indexOf('\r\n', index) + 2
  }

  function next() {
    var _

    switch (str[index]) {
      case '+':
        return { message: content() }
      case '-':
        _ = content().split(' ')
        return { name: _[0], message: _.slice(1).join(' ') }
      case ':':
        return Number(content())
      case '$':
        _ = Number(content())
        if (_ === -1) {
          return null
        }
        skip()
        return str.slice(index, index + _)
      case '*':
        _ = Number(content())
        if (_ === -1) {
          return null
        }
        _ = new Array(_)
        skip()
        for (var i = 0; i < _.length; i++) {
          _[i] = next()
          skip()
        }
        return _
      default:
        throw new SyntaxError('Invalid input: ' + JSON.stringify(str))
    }
  }

  return next()


  while (index < str.length) {
    switch (str[index]) {
      case '+':
        return { message: content() }
      case '-':
        _ = content().split(' ')
        return { name: _[0], message: _.slice(1).join(' ') }
      case ':':
        return Number(content())
      case '$':
        _ = Number(content())
        skip()
        return str.slice(index, _)
      case '*':
        _ = new Array(Number(content()))
        for (var i = 0; i < _.length; i++) {
          _[i] = parse(str)
        }
        return _
    }
  }

  switch (str[0]) {
    case '+':
      return { message: content() }
    case '-':
      _ = content().split(' ')
      return { name: _[0], message: _.slice(1).join(' ') }
    case ':':
      return Number(content())
    case '$':
      _ = Number(content())
      console.log(str)
      str = tail()
      return str.slice(0, _)
    case '*':
      _ = new Array(Number(content()))
      for (var i = 0; i < _.length; i++) {
        str = tail()
        _[i] = parse(str)
      }
      return _
  }

  return tail()
}

module.exports = {
  stringify: stringify,
  parse: parse
}
