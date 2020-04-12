# @actualwave/multibyte-stream
This library allows to write and read data between bytes. It allows to store booleans using single bit ot store integers using less than a byte and so on.

## Motivation
I wanted smallest format I could have to store or pass data. This allows to store much more data is places like URL in form of Base64-encoded string. Like `QoCCBhCCkGIOQghIDRtkGNDAbjv5pFrjjjjjIwlkR7g=` string contains an object with numbers, booleans, array and nested object, and it could be stored in URL `htts://mydomain.com/?QoCCBhCCkGIOQghIDRtkGNDAbjv5pFrjjjjjIwlkR7g=`. This allows to persist more insignificant data on client's side without the need to save it on server.

It may also help to communicate with server or any other party. For example, some years ago communication between client and server looked like
```
- let's request something from server
- pray
- not disconnected, great
- it returns timestamps as strings, ok
- response misses some fields, ok
- response has more fields than we expected, ok
- everything received exactly as expected, impossible?
```
These days communication is usually stricter and reads like
```
- let's request something from server
- wait
- not disconnected, why so long
- it returns timestamps as strings, failure
- response misses some fields, failure
- response has more fields than we expected, failure
- everything received exactly as expected, finally, we may proceed
```
All parties that work with data know it's structure and field types, so why to pass it? Let's just communicate values and apply them to structures we already know. This means structures must be equal across all parties who works with data, but usually it is already like that.

## Usage
There are multiple ways how this package could be used -- via BitStream, Data Types or Schema.

### BitStream

Simplest way to use this package is to directly create BitStream to read or write data. BitStream contains BitReader and BitWriter, each of them could be used on their own to read or write data to [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)s.

```javascript
const stream = new BitStream();

// write data
stream.write(15, 4); // record value 15 using 4 bits
stream.write(100, 8); // record value 100 using 8 bits

// reset position
stream.setPosition(0);

// read data
console.log(stream.read(4)); // read 4 bits value, returns 15
console.log(stream.read(8)); // read 8 bits value, returns 100
```

BitStream allows to write only unsigned integer values.

You could also use BitReader or BitWriter separately.
BitWriter accepts TypedArray as a data source or constructs new Uint8Array(255 bytes) if nothing passed to setData(). BitWriter will expand TypedArray if it's position goes beyond array's capacity, so data length could be retrieved by current writing position or stored separately.

```javascript
const writer = new BitWriter();

// set default TypedArray
writer.setData();

// write some data
writer.write(1, 1);
writer.write(0, 1);
writer.write(0, 1);
writer.write(15, 4);
writer.write(100, 8);

// retrieve data
console.log(
  Array.from(writer.getData().slice(0, 2))
    .map((value) => value.toString(2).padStart(8, '0'))
    .join(' ')
);
/*
  this will show in console 10011110 11001000, the values are 1, 0, 0, 1111, 01100100
*/
```

BitReader code example:
```javascript
const reader = new BitReader();

// set data
reader.setData(Uint8Array.from([0b10011110, 0b11001000]));

// read values
reader.read(1); // 1
reader.read(1); // 0
reader.read(1); // 0
reader.read(4); // 15
reader.read(8); // 100
```

### Data Types
Data Types are classes that help to read and write data of specific types. Currently I've implemented these types
 - BoolType uses one bit to record value.
 - IntType saves real numbers. Can be customized to save number sign, use [two's complement](https://en.wikipedia.org/wiki/Two%27s_complement) for negative numbers and to use variable or specific size. Additionaly provided derived classes to record integers  with specific size -- ShortType, ByteType, UIntType, UShortType, UByteType.
 - SimpleFloatType is derived from InType. It simply multiples float to preserve specified accuracy and transforms into integer. Accuracy could be specified by passing value to constructor, by default it's 3 symbols after comma.
 - StringType writes strings using variable byte length for each character. most significant bit used to determine if new character starts(1) or current continues(0).
 - ObjectType records values of object fields to stream. It should be provided with object schema or can read object schema from populated object(properties with default values to read data types from them).
 - ArrayType uses any other type for array elements and records it's content to stream. It works with arrays that contain elements of same type, values of other types will lead to unexpected results.
 - BigIntType works with [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) values of length up to 128 bits.

> IntType with variable size uses first 3 bits to specify how many of 4-bit chunks used to record value.

### Schema
Schema object contains ObjectType in it and provides simple API to generate Uint8Array from object properties and back. Also may use [Base64](https://en.wikipedia.org/wiki/Base64)-encoded string.
```javascript
// sample data
const data = {
  bool: false,
  num: 777,
  big: 555555555555555555555555555555555n,
  arr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
  obj: {
    one: true,
    two: false,
    three: true,
    num: 8765,
  },
};

// write data and convert to Base64 string
const schema = readSchemaFrom(data);
console.log(schema.saveBase64From(data)); // QoCCBhCCkGIOQghIDRtkGNDAbjv5pFrjjjjjIwlkR7g=

// read data from Base64 string using same schema
const newData = schema.loadBase64To('QoCCBhCCkGIOQghIDRtkGNDAbjv5pFrjjjjjIwlkR7g=');
console.log(newData);
/*
{
  arr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
  big: 555555555555555555555555555555555n,
  bool: false,
  ...
*/
```
To see or save schema use toObject() method and `console.log(schema.toObject());` from example above will result in
```json
{
  "type": "object",
  "fields": {
    "bool": {
      "type": "bool"
    },
    "num": {
      "type": "int",
      "signed": true,
      "size": 0,
      "twosComplement": true
    },
    "big": {
      "type": "bigint"
    },
    "arr": {
      "type": "array",
      "elementsOfType": {
        "type": "int",
        "signed": true,
        "size": 0,
        "twosComplement": true
      }
    },
    "obj": {
      "type": "object",
      "fields": {
        "one": {
          "type": "bool"
        },
        "two": {
          "type": "bool"
        },
        "three": {
          "type": "bool"
        },
        "num": {
          "type": "int",
          "signed": true,
          "size": 0,
          "twosComplement": true
        }
      }
    }
  }
}
```
