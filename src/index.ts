import {Utf8} from "utf8-fl";

export interface BufferStreamOptions {
    offset?: number;
    allowExtend?: boolean;
    newSizeGetter?: (currentSize: number, additionalLength: number, stream: BufferStream) => number;
    extendFactory?: number;
}

export class BufferStream {
    
    buffer: Uint8Array;
    view: DataView;
    offset: number;
    allowExtend: boolean;
    newSizeGetter: (currentSize: number, additionalLength: number, stream: BufferStream) => number;
    extendFactory: number;
    
    constructor(buffer: ArrayBuffer|ArrayBufferView, options?: BufferStreamOptions) {
        this.setInternalBuffer(buffer);
        this.offset = options ? options.offset || 0 : 0;
        this.allowExtend = options ? options.allowExtend : true;
        this.newSizeGetter = options ? options.newSizeGetter : null;
        this.extendFactory = options ? options.extendFactory || 0 : 1024;
    }
    
    static alloc(size: number, options?: BufferStreamOptions): BufferStream {
        return new BufferStream(new Uint8Array(size), options);
    }
    
    setInternalBuffer(buffer: ArrayBuffer|ArrayBufferView): void {
        if (buffer instanceof ArrayBuffer) {
            this.buffer = new Uint8Array(buffer);
        }
        else if (ArrayBuffer.isView(buffer)) {
            this.buffer = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
        }
        else {
            throw new Error("Invalid buffer");
        }
        this.view = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength);
    }
    
    canRead(bytes: number): boolean {
        return this.offset + bytes <= this.buffer.byteLength
    }
    
    checkToRead(bytes: number): void {
        if (!this.canRead(bytes)) {
            throw new Error("End of stream");
        }
    }
    
    toRead(): number {
        return this.buffer.byteLength - this.offset;
    }
    
    move(offset: number): void {
        if (this.offset + offset < 0) {
            throw new Error("Out of range");
        }
        this.extend(offset);
        this.offset += offset;
    }
    
    read(length: number): Uint8Array {
        let res = this.buffer.subarray(this.offset, this.offset + length);
        this.offset += length;
        return res;
    }
    
    readInt8(): number {
        this.checkToRead(1);
        let res = this.view.getInt8(this.offset);
        this.offset += 1;
        return res;
    }
    
    readInt16LE(): number {
        this.checkToRead(2);
        let res = this.view.getInt16(this.offset, true);
        this.offset += 2;
        return res;
    }
    
    readInt16BE(): number {
        this.checkToRead(2);
        let res = this.view.getInt16(this.offset, false);
        this.offset += 2;
        return res;
    }
    
    readInt32LE(): number {
        this.checkToRead(4);
        let res = this.view.getInt32(this.offset, true);
        this.offset += 4;
        return res;
    }
    
    readInt32BE(): number {
        this.checkToRead(4);
        let res = this.view.getInt32(this.offset, false);
        this.offset += 4;
        return res;
    }
    
    readUInt8(): number {
        this.checkToRead(1);
        let res = this.view.getUint8(this.offset);
        this.offset += 1;
        return res;
    }
    
    readUInt16LE(): number {
        this.checkToRead(2);
        let res = this.view.getUint16(this.offset, true);
        this.offset += 2;
        return res;
    }
    
    readUInt16BE(): number {
        this.checkToRead(2);
        let res = this.view.getUint16(this.offset, false);
        this.offset += 2;
        return res;
    }
    
    readUInt32LE(): number {
        this.checkToRead(4);
        let res = this.view.getUint32(this.offset, true);
        this.offset += 4;
        return res;
    }
    
    readUInt32BE(): number {
        this.checkToRead(4);
        let res = this.view.getUint32(this.offset, false);
        this.offset += 4;
        return res;
    }
    
    readFloatLE(): number {
        this.checkToRead(4);
        let res = this.view.getFloat32(this.offset, true);
        this.offset += 4;
        return res;
    }
    
    readFloatBE(): number {
        this.checkToRead(4);
        let res = this.view.getFloat32(this.offset, false);
        this.offset += 4;
        return res;
    }
    
    readDoubleLE(): number {
        this.checkToRead(8);
        let res = this.view.getFloat64(this.offset, true);
        this.offset += 8;
        return res;
    }
    
    readDoubleBE(): number {
        this.checkToRead(8);
        let res = this.view.getFloat64(this.offset, false);
        this.offset += 8;
        return res;
    }
    
    getNewBufferSize(additionalLength: number) {
        if (this.newSizeGetter) {
            return this.newSizeGetter(this.buffer.byteLength, additionalLength, this);
        }
        return this.buffer.byteLength + Math.max(additionalLength, this.extendFactory);
    }
    
    extend(additionalLength: number): void {
        if (this.offset + additionalLength <= this.buffer.byteLength) {
            return;
        }
        if (this.allowExtend === false) {
            throw new Error("End of stream");
        }
        let oldBuffer = this.buffer;
        let newSize = Math.max(this.buffer.byteLength + additionalLength, this.getNewBufferSize(additionalLength) || 0);
        this.setInternalBuffer(new Uint8Array(newSize));
        this.buffer.set(oldBuffer);
    }
    
    write(data: Uint8Array|number[]): number {
        this.extend(data.length);
        this.buffer.set(data, this.offset);
        this.offset += data.length;
        return data.length;
    }
    
    writeInt8(data: number): void {
        if (!Number.isInteger(data) || data < -128 || data > 127) {
            throw new Error("Invalid data");
        }
        this.extend(1);
        this.view.setInt8(this.offset, data);
        this.offset += 1;
    }
    
    writeInt16LE(data: number): void {
        if (!Number.isInteger(data) || data < -32768 || data > 32767) {
            throw new Error("Invalid data");
        }
        this.extend(2);
        this.view.setInt16(this.offset, data, true);
        this.offset += 2;
    }
    
    writeInt16BE(data: number): void {
        if (!Number.isInteger(data) || data < -32768 || data > 32767) {
            throw new Error("Invalid data");
        }
        this.extend(2);
        this.view.setInt16(this.offset, data, false);
        this.offset += 2;
    }
    
    writeInt32LE(data: number): void {
        if (!Number.isInteger(data) || data < -2147483648 || data > 2147483647) {
            throw new Error("Invalid data");
        }
        this.extend(4);
        this.view.setInt32(this.offset, data, true);
        this.offset += 4;
    }
    
    writeInt32BE(data: number): void {
        if (!Number.isInteger(data) || data < -2147483648 || data > 2147483647) {
            throw new Error("Invalid data");
        }
        this.extend(4);
        this.view.setInt32(this.offset, data, false);
        this.offset += 4;
    }
    
    writeUInt8(data: number): void {
        if (!Number.isInteger(data) || data < 0 || data > 255) {
            throw new Error("Invalid data");
        }
        this.extend(1);
        this.view.setUint8(this.offset, data);
        this.offset += 1;
    }
    
    writeUInt16LE(data: number): void {
        if (!Number.isInteger(data) || data < 0 || data > 65535) {
            throw new Error("Invalid data");
        }
        this.extend(2);
        this.view.setUint16(this.offset, data, true);
        this.offset += 2;
    }
    
    writeUInt16BE(data: number): void {
        if (!Number.isInteger(data) || data < 0 || data > 65535) {
            throw new Error("Invalid data");
        }
        this.extend(2);
        this.view.setUint16(this.offset, data, false);
        this.offset += 2;
    }
    
    writeUInt32LE(data: number): void {
        if (!Number.isInteger(data) || data < 0 || data > 4294967295) {
            throw new Error("Invalid data");
        }
        this.extend(4);
        this.view.setUint32(this.offset, data, true);
        this.offset += 4;
    }
    
    writeUInt32BE(data: number): void {
        if (!Number.isInteger(data) || data < 0 || data > 4294967295) {
            throw new Error("Invalid data");
        }
        this.extend(4);
        this.view.setUint32(this.offset, data, false);
        this.offset += 4;
    }
    
    writeFloatLE(data: number): void {
        this.extend(4);
        this.view.setFloat32(this.offset, data, true);
        this.offset += 4;
    }
    
    writeFloatBE(data: number): void {
        this.extend(4);
        this.view.setFloat32(this.offset, data, false);
        this.offset += 4;
    }
    
    writeDoubleLE(data: number): void {
        this.extend(8);
        this.view.setFloat64(this.offset, data, true);
        this.offset += 8;
    }
    
    writeDoubleBE(data: number): void {
        this.extend(8);
        this.view.setFloat64(this.offset, data, false);
        this.offset += 8;
    }
    
    //===================================
    
    readBoolean(): boolean {
        return this.readUInt8() != 0;
    }
    
    writeBoolean(value: boolean): void {
        this.writeUInt8(value ? 1 : 0);
    }
    
    //-----------------------------------
    
    readInt(): number {
        let res = 0;
        let first = true;
        let minus = false;
        let m = 1;
        while (true) {
            let o = this.readUInt8();
            if (first) {
                first = false;
                if (o < 128) {
                    return o >= 64 ? 63 - o : o;
                }
                else {
                    o = o - 128;
                    minus = o >= 64;
                    res += minus ? o - 63 : o;
                    m *= 64;
                }
            }
            else {
                if (o < 128) {
                    res += m * o;
                    return minus ? -res : res;
                }
                else {
                    res += m * (o - 128);
                    m *= 128;
                }
            }
        }
    }
    
    writeInt(data: number): number {
        if (!Number.isInteger(data)) {
            throw new Error("Invalid data");
        }
        let startOffset = this.offset;
        let minus = data < 0;
        let first = true;
        data = minus ? -data - 1 : data;
        while (true) {
            if (first) {
                first = false;
                if (data < 64) {
                    this.writeUInt8(data + (minus ? 64 : 0));
                    return this.offset - startOffset;
                }
                else {
                    let a = data % 64;
                    this.writeUInt8(a + 128 + (minus ? 64 : 0));
                    data = Math.floor(data / 64);
                }
            }
            else {
                if (data < 128) {
                    this.writeUInt8(data);
                    return this.offset - startOffset;
                }
                else {
                    let a = data % 128;
                    this.writeUInt8(a + 128);
                    data = Math.floor(data / 128);
                }
            }
        }
    }
    
    //-----------------------------------
    
    readUInt(): number {
        let res = 0;
        let m = 1;
        while (true) {
            let o = this.readUInt8();
            if (o < 128) {
                res += m * o;
                return res;
            }
            else {
                res += m * (o - 128);
                m *= 128;
            }
        }
    }
    
    writeUInt(data: number): number {
        if (!Number.isInteger(data) || data < 0) {
            throw new Error("Invalid data");
        }
        let startOffset = this.offset;
        while (true) {
            if (data < 128) {
                this.writeUInt8(data);
                return this.offset - startOffset;
            }
            else {
                let a = data % 128;
                this.writeUInt8(a + 128);
                data = Math.floor(data / 128);
            }
        }
    }
    
    //-----------------------------------
    
    readPacked(): Uint8Array {
        let length = this.readUInt();
        return this.read(length);
    }
    
    writePacked(data: Uint8Array|number[]): number {
        let lengthSize = this.writeUInt(data.length);
        return lengthSize + this.write(data);
    }
    
    //-----------------------------------
    
    readUtf8String(length: number): string {
        return Utf8.decode(this.read(length));
    }
    
    writeUtf8String(data: string): number {
        return this.write(Utf8.encode(data));
    }
    
    //-----------------------------------
    
    readPackedUtf8String(): string {
        return Utf8.decode(this.readPacked());
    }
    
    writePackedUtf8String(data: string): number {
        return this.writePacked(Utf8.encode(data));
    }
    
    //-----------------------------------
    
    getLeftBuffer(): Uint8Array {
        return this.buffer.subarray(0, this.offset);
    }
    
    getRightBuffer(): Uint8Array {
        return this.buffer.subarray(this.offset);
    }
    
    getRightBufferAsUtf8String(): string {
        return Utf8.decode(this.getRightBuffer());
    }
    
    //====================================
    
    static readInt8(data: ArrayBuffer|ArrayBufferView): number {
        return new BufferStream(data).readInt8();
    }
    
    static readInt16LE(data: ArrayBuffer|ArrayBufferView): number {
        return new BufferStream(data).readInt16LE();
    }
    
    static readInt16BE(data: ArrayBuffer|ArrayBufferView): number {
        return new BufferStream(data).readInt16BE();
    }
    
    static readInt32LE(data: ArrayBuffer|ArrayBufferView): number {
        return new BufferStream(data).readInt32LE();
    }
    
    static readInt32BE(data: ArrayBuffer|ArrayBufferView): number {
        return new BufferStream(data).readInt32BE();
    }
    
    static readUInt8(data: ArrayBuffer|ArrayBufferView): number {
        return new BufferStream(data).readUInt8();
    }
    
    static readUInt16LE(data: ArrayBuffer|ArrayBufferView): number {
        return new BufferStream(data).readUInt16LE();
    }
    
    static readUInt16BE(data: ArrayBuffer|ArrayBufferView): number {
        return new BufferStream(data).readUInt16BE();
    }
    
    static readUInt32LE(data: ArrayBuffer|ArrayBufferView): number {
        return new BufferStream(data).readUInt32LE();
    }
    
    static readUInt32BE(data: ArrayBuffer|ArrayBufferView): number {
        return new BufferStream(data).readUInt32BE();
    }
    
    static readFloatLE(data: ArrayBuffer|ArrayBufferView): number {
        return new BufferStream(data).readFloatLE();
    }
    
    static readFloatBE(data: ArrayBuffer|ArrayBufferView): number {
        return new BufferStream(data).readFloatBE();
    }
    
    static readDoubleLE(data: ArrayBuffer|ArrayBufferView): number {
        return new BufferStream(data).readDoubleLE();
    }
    
    static readDoubleBE(data: ArrayBuffer|ArrayBufferView): number {
        return new BufferStream(data).readDoubleBE();
    }
    
    static writeInt8(data: number): Uint8Array {
        let stream = BufferStream.alloc(1);
        stream.writeInt8(data);
        return stream.getLeftBuffer();
    }
    
    static writeInt16LE(data: number): Uint8Array {
        let stream = BufferStream.alloc(2);
        stream.writeInt16LE(data);
        return stream.getLeftBuffer();
    }
    
    static writeInt16BE(data: number): Uint8Array {
        let stream = BufferStream.alloc(2);
        stream.writeInt16BE(data);
        return stream.getLeftBuffer();
    }
    
    static writeInt32LE(data: number): Uint8Array {
        let stream = BufferStream.alloc(4);
        stream.writeInt32LE(data);
        return stream.getLeftBuffer();
    }
    
    static writeInt32BE(data: number): Uint8Array {
        let stream = BufferStream.alloc(4);
        stream.writeInt32BE(data);
        return stream.getLeftBuffer();
    }
    
    static writeUInt8(data: number): Uint8Array {
        let stream = BufferStream.alloc(1);
        stream.writeUInt8(data);
        return stream.getLeftBuffer();
    }
    
    static writeUInt16LE(data: number): Uint8Array {
        let stream = BufferStream.alloc(2);
        stream.writeUInt16LE(data);
        return stream.getLeftBuffer();
    }
    
    static writeUInt16BE(data: number): Uint8Array {
        let stream = BufferStream.alloc(2);
        stream.writeUInt16BE(data);
        return stream.getLeftBuffer();
    }
    
    static writeUInt32LE(data: number): Uint8Array {
        let stream = BufferStream.alloc(4);
        stream.writeUInt32LE(data);
        return stream.getLeftBuffer();
    }
    
    static writeUInt32BE(data: number): Uint8Array {
        let stream = BufferStream.alloc(4);
        stream.writeUInt32BE(data);
        return stream.getLeftBuffer();
    }
    
    static writeFloatLE(data: number): Uint8Array {
        let stream = BufferStream.alloc(4);
        stream.writeFloatLE(data);
        return stream.getLeftBuffer();
    }
    
    static writeFloatBE(data: number): Uint8Array {
        let stream = BufferStream.alloc(4);
        stream.writeFloatBE(data);
        return stream.getLeftBuffer();
    }
    
    static writeDoubleLE(data: number): Uint8Array {
        let stream = BufferStream.alloc(8);
        stream.writeDoubleLE(data);
        return stream.getLeftBuffer();
    }
    
    static writeDoubleBE(data: number): Uint8Array {
        let stream = BufferStream.alloc(8);
        stream.writeDoubleBE(data);
        return stream.getLeftBuffer();
    }
    
    //===================================
    
    static readBoolean(data: ArrayBuffer|ArrayBufferView): boolean {
        return new BufferStream(data).readBoolean();
    }
    
    static writeBoolean(value: boolean): Uint8Array {
        let stream = BufferStream.alloc(1);
        stream.writeBoolean(value);
        return stream.getLeftBuffer();
    }
    
    //-----------------------------------
    
    static readInt(data: ArrayBuffer|ArrayBufferView): number {
        return new BufferStream(data).readInt();
    }
    
    static writeInt(data: number): Uint8Array {
        let stream = BufferStream.alloc(8);
        stream.writeInt(data);
        return stream.getLeftBuffer();
    }
    
    //-----------------------------------
    
    static readUInt(data: ArrayBuffer|ArrayBufferView): number {
        return new BufferStream(data).readUInt();
    }
    
    static writeUInt(data: number): Uint8Array {
        let stream = BufferStream.alloc(8);
        stream.writeUInt(data);
        return stream.getLeftBuffer();
    }
    
    //-----------------------------------
    
    static readPacked(data: ArrayBuffer|ArrayBufferView): Uint8Array {
        return new BufferStream(data).readPacked();
    }
    
    static writePacked(data: Uint8Array|number[]): Uint8Array {
        let stream = BufferStream.alloc(8 + data.length);
        stream.writePacked(data);
        return stream.getLeftBuffer();
    }
    
    //-----------------------------------
    
    static readUtf8String(data: ArrayBuffer|ArrayBufferView, length?: number): string {
        return new BufferStream(data).readUtf8String(length == null ? data.byteLength : length);
    }
    
    static writeUtf8String(data: string): Uint8Array {
        return Utf8.encode(data);
    }
    
    //-----------------------------------
    
    static readPackedUtf8String(data: ArrayBuffer|ArrayBufferView): string {
        return new BufferStream(data).readPackedUtf8String();
    }
    
    static writePackedUtf8String(data: string): Uint8Array {
        return BufferStream.writePacked(Utf8.encode(data));
    }
}
