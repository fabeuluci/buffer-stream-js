buffer-stream-js
====

Easy to use Uint8Array stream for read and write.

Example
---

```typescript
import {BufferStream} from "buffer-stream-js";

//Create BufferStream
let writeStream = BufferStream.alloc(1024);
//Write some data
writeStream.writeUInt8(34);
writeStream.writeFloatBE(5.234);
writeStream.writePackedUtf8String("Hello world!");
//Get result as Uint8Array
let result = writeStream.getLeftBuffer();

//Create BufferStream from Uint8Array
let readStream = new BufferStream(result);
//Read data
console.log(readStream.readUint8());
console.log(readStream.readFloatBE());
console.log(readStream.readPackedUtf8String());
```

Documentation
---

```typescript
//Create BufferStream from ArrayBuffer or Uint8Array
new BufferStream(buffer: ArrayBuffer | ArrayBufferView);

//Creae with allocated memory
BufferStream.alloc(size: number): BufferStream;

//Read data and move cursor
bufferStream.read(length: number): Uint8Array
bufferStream.readInt8(): number
bufferStream.readInt16LE(): number
bufferStream.readInt16BE(): number
bufferStream.readInt32LE(): number
bufferStream.readInt32BE(): number
bufferStream.readUInt8(): number
bufferStream.readUInt16LE(): number
bufferStream.readUInt16BE(): number
bufferStream.readUInt32LE(): number
bufferStream.readUInt32BE(): number
bufferStream.readFloatLE(): number
bufferStream.readFloatBE(): number
bufferStream.readDoubleLE(): number
bufferStream.readDoubleBE(): number

//Write data and move cursor
bufferStream.write(data: ArrayBuffer | ArrayBufferView | number[]): number
bufferStream.writeInt8(data: number): void
bufferStream.writeInt16LE(data: number): void
bufferStream.writeInt16BE(data: number): void
bufferStream.writeInt32LE(data: number): void
bufferStream.writeInt32BE(data: number): void
bufferStream.writeUInt8(data: number): void
bufferStream.writeUInt16LE(data: number): void
bufferStream.writeUInt16BE(data: number): void
bufferStream.writeUInt32LE(data: number): void
bufferStream.writeUInt32BE(data: number): void
bufferStream.writeFloatLE(data: number): void
bufferStream.writeFloatBE(data: number): void
bufferStream.writeDoubleLE(data: number): void
bufferStream.writeDoubleBE(data: number): void

//Read & write boolean and move cursor, false is 0, true is 1 (one-byte)
bufferStream.readBoolean(): boolean
bufferStream.writeBoolean(value: boolean): void

//Read & write dynamic size int
bufferStream.readInt(): number
bufferStream.writeInt(data: number): number

//Read & write dynamic size unsigned int
bufferStream.readUInt(): number
bufferStream.writeUInt(data: number): number

//Read & write packed data, first packed data has dynamic uint which indicates data length, and then the data
bufferStream.readPacked(): Uint8Array
bufferStream.writePacked(data: ArrayBuffer | ArrayBufferView | number[]): number

//Read & write utf8 string
bufferStream.readUtf8String(length: number): string
bufferStream.writeUtf8String(data: string): number

//Read & write packed utf8 string, first packed data has dynamic uint which indicates data length, and then the data
bufferStream.readPackedUtf8String(): string
bufferStream.writePackedUtf8String(data: string): number

//Get buffers

//Gives you left part of stream
bufferStream.getLeftBuffer(): Uint8Array
//Gives you unread part of stream
bufferStream.getRightBuffer(): Uint8Array
//Gives you unread part of stream as utf8 string
bufferStream.getRightBufferAsUtf8String(): string

//Utils methods

//Move cursor
bufferStream.move(offset: number): void
//Check if there is given number of bytes to read
bufferStream.canRead(bytes: number): boolean
//The same as canRead but throws expection if not
bufferStream.checkToRead(bytes: number): void
//Returns not yet read number of bytes
bufferStream.toRead(): number

//Static methods
static readInt8(data: ArrayBuffer | ArrayBufferView): number;
static readInt16LE(data: ArrayBuffer | ArrayBufferView): number;
static readInt16BE(data: ArrayBuffer | ArrayBufferView): number;
static readInt32LE(data: ArrayBuffer | ArrayBufferView): number;
static readInt32BE(data: ArrayBuffer | ArrayBufferView): number;
static readUInt8(data: ArrayBuffer | ArrayBufferView): number;
static readUInt16LE(data: ArrayBuffer | ArrayBufferView): number;
static readUInt16BE(data: ArrayBuffer | ArrayBufferView): number;
static readUInt32LE(data: ArrayBuffer | ArrayBufferView): number;
static readUInt32BE(data: ArrayBuffer | ArrayBufferView): number;
static readFloatLE(data: ArrayBuffer | ArrayBufferView): number;
static readFloatBE(data: ArrayBuffer | ArrayBufferView): number;
static readDoubleLE(data: ArrayBuffer | ArrayBufferView): number;
static readDoubleBE(data: ArrayBuffer | ArrayBufferView): number;
static writeInt8(data: number): Uint8Array;
static writeInt16LE(data: number): Uint8Array;
static writeInt16BE(data: number): Uint8Array;
static writeInt32LE(data: number): Uint8Array;
static writeInt32BE(data: number): Uint8Array;
static writeUInt8(data: number): Uint8Array;
static writeUInt16LE(data: number): Uint8Array;
static writeUInt16BE(data: number): Uint8Array;
static writeUInt32LE(data: number): Uint8Array;
static writeUInt32BE(data: number): Uint8Array;
static writeFloatLE(data: number): Uint8Array;
static writeFloatBE(data: number): Uint8Array;
static writeDoubleLE(data: number): Uint8Array;
static writeDoubleBE(data: number): Uint8Array;
static readBoolean(data: ArrayBuffer | ArrayBufferView): boolean;
static writeBoolean(value: boolean): Uint8Array;
static readInt(data: ArrayBuffer | ArrayBufferView): number;
static writeInt(data: number): Uint8Array;
static readUInt(data: ArrayBuffer | ArrayBufferView): number;
static writeUInt(data: number): Uint8Array;
static readPacked(data: ArrayBuffer | ArrayBufferView): Uint8Array;
static writePacked(data: ArrayBuffer | ArrayBufferView | number[]): Uint8Array;
static readUtf8String(data: ArrayBuffer | ArrayBufferView, length?: number): string;
static writeUtf8String(data: string): Uint8Array;
static readPackedUtf8String(data: ArrayBuffer | ArrayBufferView): string;
static writePackedUtf8String(data: string): Uint8Array;
```

License
---

The MIT License (MIT)
