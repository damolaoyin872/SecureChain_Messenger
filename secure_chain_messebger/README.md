# Encrypted On-Chain Messaging Relay

A secure, decentralized messaging system that stores encrypted messages on the Stacks blockchain while maintaining privacy through end-to-end encryption.

## Overview

The Encrypted On-Chain Messaging Relay enables users to send private messages to each other using blockchain technology. While the messages are stored on a public blockchain, their contents remain private through client-side encryption and decryption.

**Key Features:**
- End-to-end encryption ensures only intended recipients can read messages
- On-chain storage provides censorship resistance and message persistence
- Simple API for sending, retrieving, and managing messages

## How It Works

1. **Encryption**: Messages are encrypted on the client side using the recipient's public key
2. **Storage**: Only encrypted data blobs are stored on-chain
3. **Retrieval**: Recipients can query for messages addressed to them
4. **Decryption**: Messages are decrypted locally using the recipient's private key

## Implementation

### Smart Contract (Clarity)

The core of the system is a Clarity smart contract deployed on the Stacks blockchain. This contract:

- Manages message storage and retrieval
- Controls access to message operations
- Maintains message metadata

```clarity
;; Key functions:
(define-public (send-message (recipient principal) (encrypted-content (buff 1024))) ...)
(define-read-only (get-message (message-id uint)) ...)
(define-read-only (get-messages-for-recipient (recipient principal)) ...)
(define-public (delete-message (message-id uint)) ...)
```

### Client-Side Encryption

The security of the system relies on proper client-side encryption:

1. The sender encrypts a message using the recipient's public key
2. Only the encrypted blob is sent to the blockchain
3. The recipient decrypts the message using their private key

## Getting Started

### Prerequisites

- [Clarinet](https://github.com/hirosystems/clarinet) for local Clarity development
- Node.js environment for running the client application and tests
- Vitest for running the test suite

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/encrypted-messaging-relay.git
   cd encrypted-messaging-relay
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run tests:
   ```bash
   npm test
   ```

### Deploying

1. Deploy the contract using Clarinet:
   ```bash
   clarinet contract:deploy encrypted-messaging
   ```

2. Use the client library to interact with the contract:
   ```javascript
   import { connectToStacks, sendEncryptedMessage } from './client';
   
   // Send a message
   const result = await sendEncryptedMessage(
     recipientAddress,
     "This is a secret message",
     recipientPublicKey
   );
   ```

## Security Considerations

- **Key Management**: Users must securely manage their private keys
- **Message Size**: Messages are limited to 1024 bytes to prevent blockchain bloat
- **Metadata Privacy**: While message content is encrypted, metadata (sender, recipient, timestamp) is visible on-chain

## Testing

The project includes comprehensive tests written with Vitest:

```bash
npm test
```

Tests cover:
- Message sending and retrieval
- Access control for message operations
- Encryption and decryption workflow
- Edge cases and error handling

## Future Enhancements

- Message expiration dates
- Group messaging capabilities
- Message read receipts
- Message threading and replies
- Integration with decentralized identity solutions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Stacks blockchain community
- Clarity smart contract language developers
- Contributors to end-to-end encryption standards