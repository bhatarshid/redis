# Redis Clone Documentation

## Introduction

This document provides detailed documentation for a simple Redis-like server implementation in Node.js. This server is built from scratch and supports a subset of Redis commands. It is designed to be a learning tool for understanding how a simple in-memory database like Redis works.

## Features

- In-memory data storage
- TCP server that listens on port 6379
- Support for a subset of Redis commands: `PING`, `ECHO`, `SET`, `GET`, `RPUSH`, `LRANGE`, `LPOP`, `TYPE`
- Expiration of keys
- List data structure support

## Getting Started

### Prerequisites

- Node.js installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd redis-clone
   ```
3. Run the server:
   ```bash
   node app/main.js
   ```

The server will start and listen on `127.0.0.1:6379`.

## Usage

You can interact with the server using a Redis client like `redis-cli` or any other client that supports the Redis protocol.

Example using `redis-cli`:
```bash
redis-cli
127.0.0.1:6379> PING
PONG
127.0.0.1:6379> SET mykey "Hello, World!"
OK
127.0.0.1:6379> GET mykey
"Hello, World!"
```

## Commands

The following commands are supported by this Redis clone:

### PING

- **Syntax**: `PING`
- **Description**: Returns "PONG". This command is often used to test if a connection is still alive.
- **Example**:
  ```
  127.0.0.1:6379> PING
  PONG
  ```

### ECHO

- **Syntax**: `ECHO <message>`
- **Description**: Returns the given message.
- **Example**:
  ```
  127.0.0.1:6379> ECHO "Hello, World!"
  "Hello, World!"
  ```

### SET

- **Syntax**: `SET <key> <value> [EX <seconds> | PX <milliseconds>]`
- **Description**: Sets the given string value of a key. The optional `EX` and `PX` options set an expiration time on the key.
- **Options**:
  - `EX <seconds>`: Set the specified expire time, in seconds.
  - `PX <milliseconds>`: Set the specified expire time, in milliseconds.
- **Example**:
  ```
  127.0.0.1:6379> SET mykey "Hello"
  OK
  127.0.0.1:6379> SET anotherkey "World" EX 10
  OK
  ```

### GET

- **Syntax**: `GET <key>`
- **Description**: Get the value of a key. If the key does not exist, `(nil)` is returned.
- **Example**:
  ```
  127.0.0.1:6379> GET mykey
  "Hello"
  ```

### RPUSH

- **Syntax**: `RPUSH <key> <element> [<element> ...]`
- **Description**: Append one or more elements to the end of a list.
- **Example**:
  ```
  127.0.0.1:6379> RPUSH mylist "one" "two" "three"
  (integer) 3
  ```

### LRANGE

- **Syntax**: `LRANGE <key> <start> <stop>`
- **Description**: Returns the specified elements of the list stored at `key`. The offsets `start` and `stop` are zero-based indexes.
- **Example**:
  ```
  127.0.0.1:6379> LRANGE mylist 0 1
  1) "one"
  2) "two"
  ```

### LPOP

- **Syntax**: `LPOP <key> [count]`
- **Description**: Removes and returns the first `count` elements of the list stored at `key`. If `count` is not specified, it defaults to 1.
- **Example**:
  ```
  127.0.0.1:6379> LPOP mylist
  "one"
  ```

### TYPE

- **Syntax**: `TYPE <key>`
- **Description**: Returns the string representation of the type of the value stored at `key`. The different types that can be returned are: `string`, `list`, and `none` when the key does not exist.
- **Example**:
  ```
  127.0.0.1:6379> TYPE mykey
  string
  127.0.0.1:6379> TYPE mylist
  list
  ```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License

This project is licensed under the MIT License.
