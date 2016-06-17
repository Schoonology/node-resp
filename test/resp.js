var expect = require('chai').expect
  , resp = require('../lib')

describe('Resp', function () {
  describe('stringify', function () {
    it('should stringify Status objects', function () {
      expect(resp.stringify({
        message: 'Some message'
      })).to.equal('+Some message\r\n')
    })

    it('should stringify Error objects', function () {
      expect(resp.stringify({
        name: 'BADERR',
        message: 'Some message'
      })).to.equal('-BADERR Some message\r\n')
    })

    it('should stringify Error objects', function () {
      expect(resp.stringify(new Error('Native message'))).to.equal('-Error Native message\r\n')
    })

    it('should stringify booleans', function () {
      expect(resp.stringify(true)).to.equal(':1\r\n')
    })

    it('should stringify numbers', function () {
      expect(resp.stringify(123)).to.equal(':123\r\n')
    })

    it('should stringify strings', function () {
      expect(resp.stringify('foobar')).to.equal('$6\r\nfoobar\r\n')
    })

    it('should stringify arrays', function () {
      expect(resp.stringify([1, 2, 'foo', 'bar', 5, false]))
        .to.equal('*6\r\n:1\r\n:2\r\n$3\r\nfoo\r\n$3\r\nbar\r\n:5\r\n:0\r\n')
    })

    it('should stringify arrays of Errors', function () {
      expect(resp.stringify([new Error('message')]))
        .to.equal('*1\r\n-Error message\r\n')
    })

    it('should stringify null', function () {
      expect(resp.stringify(null))
        .to.equal('$-1\r\n')
    })

    it('should stringify undefined as null', function () {
      expect(resp.stringify())
        .to.equal('$-1\r\n')
    })

    it('should fail on other Objects', function () {
      expect(function () {
        resp.stringify({})
      }).to.throw(TypeError)
    })
  })

  describe('parse', function () {
    it('should parse Status objects', function () {
      expect(resp.parse('+Some message\r\n')).to.deep.equal({
        message: 'Some message'
      })
    })

    it('should parse Error objects', function () {
      expect(resp.parse('-BADERR Some message\r\n')).to.deep.equal({
        name: 'BADERR',
        message: 'Some message'
      })
    })

    it('should parse "booleans" as a number', function () {
      expect(resp.parse(':1\r\n')).to.equal(1)
    })

    it('should parse numbers', function () {
      expect(resp.parse(':123\r\n')).to.equal(123)
    })

    it('should parse strings', function () {
      expect(resp.parse('$6\r\nfoobar\r\n')).to.equal('foobar')
    })

    it('should parse arrays', function () {
      expect(resp.parse('*6\r\n:1\r\n:2\r\n$3\r\nfoo\r\n$3\r\nbar\r\n:5\r\n:0\r\n'))
        .to.deep.equal([1, 2, 'foo', 'bar', 5, 0])
    })

    it('should parse null bulk strings', function () {
      expect(resp.parse('$-1\r\n'))
        .to.equal(null)
    })

    it('should parse null arrays', function () {
      expect(resp.parse('*-1\r\n'))
        .to.equal(null)
    })

    it('should fail on bad input', function () {
      expect(function () {
        resp.parse('invalid')
      }).to.throw(SyntaxError)
    })
  })

  describe('round trip', function () {
    function generateTest(value) {
      it(JSON.stringify(value), function () {
        expect(resp.parse(resp.stringify(value))).to.deep.equal(value)
      })
    }

    generateTest(['WORK', 1000])
    generateTest([null])
    generateTest([{ message: 'Status' }, 42, 0, null, '', 'foobar'])
  })
})
