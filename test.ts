"use strict";
// bare function example
/// <reference path="../../../../typings/tsd.d.ts" />
/// <reference path="../../../../typings/jasmine/jasmine.d.ts" />





// This is the code we'll be working with

//     z = x / y;


     
     
     


     
     

// First requirement:  Each time you call a function with the same parameters, it returns the same result.


// First approach: make a function
describe("function div; with global variables.", function() {
    var x;
    var y;
    var div = function() {
        return x / y;
    };

    it('divides x by y',function() {
        x=3;
        y=4;
        expect(div()).toBe(0.75);
    })
});
// Hint: uses global variables



describe("object with method div; object properties.", function() {
    var Div = function(){
        this.x = 3;
        this.y = 4;
        this.div = function() { return this.x / this.y; }
    }

    it('divides x by y',function() {
        var d = new Div();
        expect(d.div()).toBe(0.75);
    })
});
// Hint: uses class members
// Hint: what is "this"?


// Next approach: make a Typescript Class, class method
describe("TS: class method div, with instance variables.", function() {
    class Div {
        public x: number;
        public y: number;
        constructor() { }

        public div(): number {
            return this.x / this.y;
        }
    };
    it('divides x by y',function() {
        let instance = new Div();
        instance.x = 3;
        instance.y = 4;
        expect(instance.div()).toBe(0.75);
    })
})
// Hint: same problem as above, except for "this"







// Pure function.  Depends only on passed-in parameters, and returns a value.
// This method is a class method
describe("class method with parameters", function() {
    class Div {
        public div(x: number, y: number): number {
            return x / y;
        }
    };
    it('divides x by y',function() {
        let instance = new Div();
        expect(instance.div(3,4)).toBe(0.75);
    })
})




// Javascript (and typescript) lets functions be global.
describe("pure function", function() {
    function div(x: number, y: number): number {
        return x / y;
    }
    it('divides x by y',function() {
        expect(div(3,4)).toBe(0.75);
    })
})






// Second requirement: Does not throw exceptions.


// Avoid "primitive obsession"
// Ensure that parameters meet problem domain requirements
// Hint: person record with no email address
// Hint: null object


// Domain: divide by zero
describe("Divide by zero, primitive obsession", function() {
    function div(x: number, y: number): number {
        return x / y;
    }
    it('divides x by y',function() {
        expect(div(3,0)).toBe( Number.POSITIVE_INFINITY);
    })
})
// Here I was surprised.  In C# you get an exception; in javascript you get Number.POSTIVE_INFINITY
// But same as NaN poisoning


class NonZeroNumber {
    private _num: number;
    get num () : number { return this._num; }
    constructor(readonly n: number) {
        if (n === null || n === undefined || isNaN(n))
            throw ("Cannot construct NonZeroNumber with non numeric value");
        if (n === 0)
            throw ("Cannot construct NonZeroNumber with value 0");
        this._num = n;
    }
}

describe('Verify functionality of NonZeroNumber class', function() {
    it('cannot construct a NonZeroNumber with value 0', function() {
        expect(function() { new NonZeroNumber(0)}).toThrow();
    })
    it('cannot take a null',function() {
        expect(function() { new NonZeroNumber(null)}).toThrow();
    })
    it('cannot take undefined',function() {
        expect(function() { new NonZeroNumber(undefined)}).toThrow();
    })
    it('cannot take Nan',function() {
        expect(function() { new NonZeroNumber(NaN)}).toThrow();
    })

    // Typescript typechecking
    //it('cannot take a non-number argument', function() {
    //    expect((new NonZeroNumber('5')).num).toBe(5);
    //})
    it('can construct a NonZeroNumber with acceptable value', function() {
        expect((new NonZeroNumber(5)).num).toBe(5);
    })
})

describe("passing a NonZeroNumber arguments", function() {
    function div(x: number, y: NonZeroNumber): number {
        return x / y.num;
    }
    it('takes a correctly defined argument', function() {
        expect(div(3,new NonZeroNumber(4))).toBe(0.75);
    })

    // Typescript typechecking
    //it('cannot take a non-NonZeroNumber argument', function() {
    //    expect(div(3,4)).toBe(0.75);
    //})

    // Typescript typechecking
    //it('cannot take a null second argument', function() {
    //    expect(div(3,null)).toBe(0.75);
    //})
})
// Hint: Webstorm indicates an error, but compiles it and runs it.
// Hint: Typscript does not have a built-in runtime null check
// Hint: C# null check




// Primitive obsession for first argument.
describe("First argument should be a real number", function() {
    function div(x: number, y: NonZeroNumber): number {
        return x / y.num;
    }

    it('accepts NaN for first argument', function() {
        expect(isNaN(div(Number.NaN,new NonZeroNumber(4)))).toBe(true);
    })
})

class RealNumber {
    private _num: number;
    get num () : number { return this._num; }
    constructor(readonly n: number) {
        if (n === null || n === undefined || isNaN(n))
            throw ("Cannot construct NonZeroNumber with non numeric value");
        this._num = n;
    }
}

describe("requires a first argument that is a real number", function() {
    function div(x: RealNumber, y: NonZeroNumber): number {
        return x.num / y.num;
    }

    it('Computes a correct value', function() {
        expect(div(new RealNumber(3),new NonZeroNumber(4))).toBe(0.75);
    })
})


// Third Requirement: does not produce garbage output
// Hint: separating first, last name
// Hint: finite representation of mantissa
// Hint: null object pattern

describe("you must deal with range ", function() {
    function div(x: RealNumber, y: NonZeroNumber): number {
        return x.num / y.num;
    }

    it('Can produce a number larger than can be represented by "number"', function() {
        expect(div(new RealNumber(Number.MAX_VALUE),new NonZeroNumber(0.1))).toBe(Number.POSITIVE_INFINITY);
    })

    it('Numbers smaller than minimum are set to 0', function() {
        expect(div(new RealNumber(Number.MIN_VALUE*100),new NonZeroNumber(Number.MAX_VALUE)) * Number.MIN_VALUE).toBe(0);
    })

    // Also note that numbers are not arbitrary precision.  What is 1 / 3 ???
})

// Fourth requirement: does not throw an exception
// Always returns a result

describe("Don't throw; return an object with success/failure indication", function() {

    class DivResult {
        public Ok: number;
        public Error: string;
    }
    function div(x: RealNumber, y: NonZeroNumber): DivResult {
        let result = new DivResult();
        try {
            if (x.num > 200) {
                throw "x is too big";
            }
            result.Ok = x.num / y.num;
        }
        catch (e) {
            result.Error = e;
        }
        finally {
            return result;
        }
    }

    it('returns an error state for a number larger than can be represented by "number"', function() {
        expect(div(new RealNumber(Number.MAX_VALUE),new NonZeroNumber(0.1)).Error).toBe('x is too big');
    })
    it ('Returns a Ok result for normal calculations', function() {
        expect(div(new RealNumber(10), new NonZeroNumber(2)).Ok).toBe(5);
    })
})
// Hint: function returns a Result object.  User can choose to not check for Error, but that's a user issue.


// Javascript has a built-in mechanism -- Promises
describe("Return a promise", function() {
    function div(x: RealNumber, y: NonZeroNumber): DivResult {
        var p = new Promise(function(resolve,reject) {
            try {
                if (x.num > 200) {
                    throw "x is too big";
                }
                resolve(x.num / y.num);
            }
            catch (e) {
                reject(e);
            }
        });
        return p;
    }

    it('rejects the promise when producing a number larger than can be represented by "number"', function(done) {
        var p = div(new RealNumber(Number.MAX_VALUE),new NonZeroNumber(0.1));
        p.then(function() { fail('should fail, but didnt'); done(); });
        p.catch(function() { console.log('passed'); done()})
    })
    it('resolves the promise for normal calculations', function(done) {
        var p = div(new RealNumber(10),new NonZeroNumber(2));
        p.then(function(n) { expect(n).toBe(5); console.log('passed'); done(); });
        p.catch(function() { fail('should not have failed, but did'); done()})
    })
})

