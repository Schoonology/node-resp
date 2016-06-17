# Resp

An implementation of the [Redis Encoding and Serialization Protocol][resp] for
Node.js.

## Example

```
resp.stringify(['MAKE', 'Widget', 6, '$0.40', true])
// => '*5\r\n$4\r\nMAKE\r\n$6\r\nWidget\r\n:6\r\n$5\r\n$0.40\r\n:1\r\n'
resp.parse('+A-OK\r\n')
// => { message: 'A-OK' }
```

## Serialize: `resp.stringify(value)`

Stringifies `value` into its RESP representation, returning the result as a
`String`. The legal values (as specified by RESP) are:

- "Status objects", which have a single `message` string (e.g.
  `{ "message": "This is the status message." }`).
- Error objects
- Booleans
- Strings
- Numbers
- Arrays including any of the above

Other types and values will throw a `TypeError` describing the issue.

## Deserialize: `resp.parse(string)`

Parses the RESP in `string`, returning the represented value as its native
type. See `resp.stringify`, above, for the supported types that may be returned.

If the input is not valid RESP, a `SyntaxError` will be thrown describing the
issue.

## TODO

 - Optimization
 - Transform streams

[resp]: http://redis.io/topics/protocol
