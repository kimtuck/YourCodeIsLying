"use strict";
// Preliminaries
// * Unit tests
// * All tests in this file pass.
describe('sample unit tests', function () {
    var x;
    var y;
    beforeEach(function () {
        x = 3;
        y = 4;
    });
    it('adds two numbers', function () {
        expect(x + y).toBe(7);
    });
    it('adds a different number', function () {
        x = 12;
        expect(x + y).toBe(16);
    });
    // Some unexpected behavior!!!
    it('adding a string', function () {
        x = "3";
        y = 4;
        expect(x + y).toBe("34");
    });
    it('adding NaN', function () {
        x = Number.NaN;
        y = 4;
        expect(isNaN(x + y)).toBe(true);
    });
    it('adding an object', function () {
        x = { name: 'Bill' };
        y = 4;
        expect(x + y).toBe('[object Object]4');
    });
});
// Requirement 1: returns the same value when called with identical arguments.
//
// Lie 1: has different return values, depending on values of x and y.
describe("div with global variables.", function () {
    var x;
    var y;
    var div = function () {
        return x / y;
    };
    beforeEach(function () {
        x = 3;
        y = 4;
    });
    // Hey, it works!!!
    it('divides x by y', function () {
        expect(div()).toBe(0.75);
    });
    // No, not really
    it('divides x by y again', function () {
        expect(div()).toBe(0.75);
        y = 10;
        expect(div()).toBe(0.3); // not the same anymore
    });
});
// Hint: uses global variables
// Hint: tests; beforeEach
// Try encapsulation
describe("div  as member function; accessing object properties", function () {
    var Div = function () {
        this.x = 3;
        this.y = 4;
        this.div = function () { return this.x / this.y; };
    };
    it('divides x by y', function () {
        var d = new Div();
        expect(d.div()).toBe(0.75);
    });
});
// Hint: Div is a constructor
// Hint: uses class members
// Hint: what is "this"?
// Next approach: make a Typescript Class, class method
describe("TS: class method div, with instance variables.", function () {
    var Div = (function () {
        function Div() {
            this.x = 3;
            this.y = 4;
        }
        Div.prototype.div = function () { return this.x / this.y; };
        return Div;
    }());
    ;
    it('divides x by y', function () {
        var d = new Div();
        expect(d.div()).toBe(0.75);
    });
});
// Hint: same problem as above, except for "this"
// Requirement 1: returns the same value when called with identical arguments.
// Solution: Pure function
// -- Depends only on passed in parameters.
// -- Does not modify passed in parameters
// -- No side effects
// -- Must return a value  (why?)
describe("div as a pure function", function () {
    function div(x, y) {
        return x / y;
    }
    it('divides x by y', function () {
        expect(div(3, 4)).toBe(0.75);
    });
});
// Question: Is your function pure?
// Requirement 2: Enforces arguments to meet type requirements.
// Lie 2a: div can take any arguments, of any type, you pass it.
describe("div does not restrict parameters based on type", function () {
    function div(x, y) {
        return x / y;
    }
    it('divides x by y', function () {
        expect(div(3, 4)).toBe(0.75);
    });
});
// Hint: what kind of arguments can I pass into div?
// Hint -- how would you restrict types?
describe("div with parameter type checking", function () {
    function div(x, y) {
        if (arguments.length != 2)
            throw "pass two arguments";
        if (x === null || y === null)
            throw "arguments should not be null";
        if (isNaN(x) || isNaN(y))
            throw "arguments should be numbers";
        return x / y;
    }
    it('divides x by y', function () {
        expect(div(3, 4)).toBe(0.75);
    });
    it('throws on incorrect number of arguments', function () {
        expect(function () { div(2); }).toThrow();
    });
    it('throws on null', function () {
        expect(function () { div(null, null); }).toThrow();
    });
    it('throws on bad arguments', function () {
        expect(function () { div('a', 'b'); }).toThrow();
    });
});
// Hint: separation of concerns.  How much code is concerned with type checks and how much is business logic?
// Requirement 2: Enforces arguments to meet type requirements.
// Solution:
// -- Use typescript to do type checking.
describe("div as a pure function", function () {
    function div(x, y) {
        return x / y;
    }
    it('divides x by y', function () {
        expect(div(3, 4)).toBe(0.75);
    });
});
// Done!!!  -- well, maybe not.
// Requirement 2: Enforces arguments to meet problem domain requirements.
// Lie 2b -- div allows you to pass any number.  But lots of things are not really allowed.  Div by zero.
// Solution:
// Avoid "primitive obsession"
// Ensure that parameters meet problem domain requirements
// Domain:
// -- numerator and denominator are actual numbers
// -- denominator is not zero
// -- result can be represented as a javascript number
describe("div when y is zero (primitive obsession)", function () {
    function div(x, y) {
        return x / y;
    }
    it('divides x by y', function () {
        expect(div(3, 0)).toBe(Number.POSITIVE_INFINITY);
    });
});
// Here I was surprised.  In C# you get an exception;
// in javascript you get Number.POSTIVE_INFINITY
// But same as NaN poisoning
var NonZeroNumber = (function () {
    function NonZeroNumber(n) {
        this.n = n;
        if (n === null || n === undefined || isNaN(n))
            throw ("Cannot construct NonZeroNumber with non numeric value");
        if (n === 0)
            throw ("Cannot construct NonZeroNumber with value 0");
        this._num = n;
    }
    Object.defineProperty(NonZeroNumber.prototype, "num", {
        get: function () { return this._num; },
        enumerable: true,
        configurable: true
    });
    return NonZeroNumber;
}());
describe('Verify functionality of NonZeroNumber class', function () {
    it('can construct a NonZeroNumber with acceptable value', function () {
        expect((new NonZeroNumber(5)).num).toBe(5);
    });
    it('cannot construct a NonZeroNumber with value 0', function () {
        expect(function () { new NonZeroNumber(0); }).toThrow();
    });
    it('cannot take a null', function () {
        expect(function () { new NonZeroNumber(null); }).toThrow();
    });
    it('cannot take undefined', function () {
        expect(function () { new NonZeroNumber(undefined); }).toThrow();
    });
    it('cannot take Nan', function () {
        expect(function () { new NonZeroNumber(NaN); }).toThrow();
    });
    // Does not compile
    //it('cannot take a non-number argument', function() {
    //    expect((new NonZeroNumber('5')).num).toBe(5);
    //})
    //it('cannot take a non-number argument', function() {
    //    expect((new NonZeroNumber([5])).num).toBe(5);
    //})
});
describe("div with a NonZeroNumber argument", function () {
    function div(x, y) {
        return x / y.num;
    }
    it('takes a correctly defined argument', function () {
        expect(div(3, new NonZeroNumber(4))).toBe(0.75);
    });
    // Now y can be null.  We will deal with null later.
    //it('still allows null for second argument', function() {
    //    expect(div(3,null)).toBe(0.75);
    //})
    // Cannot call div anymore with a simple number as denominator.  Does not compile.
    // it('cannot take a non-NonZeroNumber argument', function() {
    //    expect(div(3,4)).toBe(0.75);
    // })
});
// Hint: Typscript does not have a built-in runtime null check
// Talking point: person record with no email address
// Fix Primitive obsession for first argument.
var RealNumber = (function () {
    function RealNumber(n) {
        this.n = n;
        if (n === null || n === undefined || isNaN(n))
            throw ("Cannot construct NonZeroNumber with non numeric value");
        this._num = n;
    }
    Object.defineProperty(RealNumber.prototype, "num", {
        get: function () { return this._num; },
        enumerable: true,
        configurable: true
    });
    return RealNumber;
}());
describe("requires a first argument that is a real number", function () {
    function div(x, y) {
        return x.num / y.num;
    }
    it('Computes a correct value', function () {
        expect(div(new RealNumber(3), new NonZeroNumber(4))).toBe(0.75);
    });
});
// Requirement 3: Always returns a useful value.
// Lie 3: all combinations of input parameters produce a useful output
// What about your code?
// div's lies:
// -- div returns the EXACT result of dividing x by y
// -- finite representation of mantissa
// -- range of numeric representation
// These are hard to fix.
describe("div range examples", function () {
    function div(x, y) {
        return x.num / y.num;
    }
    it('Does not exactly represent 1/3', function () {
        expect(div(new RealNumber(1), new NonZeroNumber(3))).toBe(0.3333333333333333);
    });
    it('Does not exactly represent large values', function () {
        expect(div(new RealNumber(10000000000000001), new NonZeroNumber(1000))).toBe(10000000000000);
    });
    it('Can produce a number larger than can be represented by "number"', function () {
        expect(div(new RealNumber(Number.MAX_VALUE), new NonZeroNumber(0.1))).toBe(Number.POSITIVE_INFINITY);
    });
    // (x/a)/a =
    it('Numbers smaller than minimum are set to 0', function () {
        expect(0.0000000000000001).not.toBe(0);
        expect(div(new RealNumber(0.0000000000000001), new NonZeroNumber(Number.MAX_VALUE))).toBe(0);
    });
});
// Requirement 4: does not throw an exception
// Lie: throws an exception
describe("throws in certain cases", function () {
    function div(x, y) {
        if (x === null || y === null)
            throw "must pass non-null arguments";
        if (x.num > 200)
            throw "x is too big";
        return x.num / y.num;
    }
    it('throws if x or y is null', function () {
        expect(function () {
            div(null, null);
        }).toThrow();
    });
});
// Solution 1: (Elm): return value is object with success/failure
describe("Don't throw; return an object with success/failure indication", function () {
    var DivResult = (function () {
        function DivResult() {
        }
        return DivResult;
    }());
    function div(x, y) {
        var result = new DivResult();
        try {
            if (x === null || y === null)
                throw "must pass non-null arguments";
            if (x.num > 200)
                throw "x is too big";
            result.Ok = x.num / y.num;
        }
        catch (e) {
            result.Error = e;
        }
        finally {
            return result;
        }
    }
    it('returns an error state for a null argument', function () {
        expect(div(null, new NonZeroNumber(0.1)).Error).toBe('must pass non-null arguments');
    });
    it('returns an error state for a number larger than can be represented by "number"', function () {
        expect(div(new RealNumber(Number.MAX_VALUE), new NonZeroNumber(0.1)).Error).toBe('x is too big');
    });
    it('Returns a Ok result for normal calculations', function () {
        expect(div(new RealNumber(10), new NonZeroNumber(2)).Ok).toBe(5);
    });
});
// Hint: function returns a Result object.  User can choose to not check for Error, but that's a user issue.
// Solution 2: Promises (success/failure callbacks)
describe("Return a promise", function () {
    function div(x, y) {
        var p = new Promise(function (resolve, reject) {
            try {
                if (x === null || y === null)
                    throw "must pass non-null arguments";
                if (x.num > 200)
                    throw "x is too big";
                resolve(x.num / y.num);
            }
            catch (e) {
                reject(e);
            }
        });
        return p;
    }
    it('rejects the promise when producing a number larger than can be represented by "number"', function () {
        var p = div(new RealNumber(Number.MAX_VALUE), new NonZeroNumber(0.1));
        p.then(function () { fail('should fail, but didnt'); });
        p.catch(function (msg) { expect(msg).toBe('x is too big'); });
    });
    it('resolves the promise for normal calculations', function () {
        var p = div(new RealNumber(10), new NonZeroNumber(2));
        p.then(function (n) { expect(n).toBe(5); });
        p.catch(function () { fail('should not have failed, but did'); });
    });
});
//# sourceMappingURL=test.js.map