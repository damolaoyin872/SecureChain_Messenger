import { describe, expect, it } from "vitest";

describe("Encrypted On-Chain Messaging Relay", () => {
  // Mock storage for messages
  const messages = new Map();
  let lastMessageId = 0;
  
  // Mock user addresses
  const alice = "ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2365PK4S";
  const bob = "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG";
  
  // Mock contract functions
  const sendMessage = (sender, recipient, encryptedContent) => {
    lastMessageId += 1;
    const messageId = lastMessageId;
    
    messages.set(messageId, {
      sender,
      recipient,
      encryptedContent,
      timestamp: Date.now()
    });
    
    return { ok: messageId };
  };
  
  const getMessage = (messageId) => {
    const message = messages.get(messageId);
    return message ? { ok: message } : { err: 1 };
  };
  
  const getMessagesForRecipient = (recipient) => {
    const matchingIds = [];
    messages.forEach((message, id) => {
      if (message.recipient === recipient) {
        matchingIds.push(id);
      }
    });
    return { ok: matchingIds };
  };
  
  const deleteMessage = (sender, messageId) => {
    const message = messages.get(messageId);
    if (!message) return { err: 1 };
    if (message.recipient !== sender) return { err: 3 };
    
    messages.delete(messageId);
    return { ok: true };
  };
  
  // Utility function for encryption simulation
  const mockEncrypt = (text, recipientKey) => {
    // This is just a simulation - in a real app, use proper encryption
    return `encrypted:${text}:for:${recipientKey}`;
  };
  
  // Utility function for decryption simulation
  const mockDecrypt = (encryptedContent, privateKey) => {
    // This is just a simulation - in a real app, use proper decryption
    const parts = encryptedContent.split(":");
    return parts[1];
  };

  // Reset data before each test
  beforeEach(() => {
    messages.clear();
    lastMessageId = 0;
  });

  it("should send and retrieve an encrypted message", () => {
    // Alice sends a message to Bob
    const originalMessage = "Hello Bob, this is a secret message!";
    const bobPublicKey = "bob-public-key";
    const encryptedContent = mockEncrypt(originalMessage, bobPublicKey);
    
    const sendResult = sendMessage(alice, bob, encryptedContent);
    expect(sendResult.ok).toBeDefined();
    
    const messageId = sendResult.ok;
    const getResult = getMessage(messageId);
    expect(getResult.ok).toBeDefined();
    expect(getResult.ok.sender).toBe(alice);
    expect(getResult.ok.recipient).toBe(bob);
    expect(getResult.ok.encryptedContent).toBe(encryptedContent);
  });

  it("should list all messages for a recipient", () => {
    // Alice sends multiple messages to Bob
    sendMessage(alice, bob, mockEncrypt("Message 1", "bob-key"));
    sendMessage(alice, bob, mockEncrypt("Message 2", "bob-key"));
    
    // Charlie sends a message to Bob
    const charlie = "ST3PF13W7Z0RRM42A8VZRVFQ75SV1K26RXEP8YGKJ";
    sendMessage(charlie, bob, mockEncrypt("Message from Charlie", "bob-key"));
    
    // Alice sends a message to someone else
    const dave = "ST5JLTA3Q9WP33ZRBTTMYNSYCX3XB9BMSBYESF86";
    sendMessage(alice, dave, mockEncrypt("Message for Dave", "dave-key"));
    
    // Get Bob's messages
    const result = getMessagesForRecipient(bob);
    expect(result.ok).toHaveLength(3);
  });

  it("should allow the recipient to delete a message", () => {
    // Alice sends a message to Bob
    const sendResult = sendMessage(alice, bob, mockEncrypt("Delete me", "bob-key"));
    const messageId = sendResult.ok;
    
    // Bob tries to delete the message
    const deleteResult = deleteMessage(bob, messageId);
    expect(deleteResult.ok).toBe(true);
    
    // Verify the message is gone
    const getResult = getMessage(messageId);
    expect(getResult.err).toBe(1);
  });

  it("should not allow non-recipients to delete a message", () => {
    // Alice sends a message to Bob
    const sendResult = sendMessage(alice, bob, mockEncrypt("Secret", "bob-key"));
    const messageId = sendResult.ok;
    
    // Alice tries to delete Bob's message
    const deleteResult = deleteMessage(alice, messageId);
    expect(deleteResult.err).toBe(3);
    
    // Verify the message still exists
    const getResult = getMessage(messageId);
    expect(getResult.ok).toBeDefined();
  });

  it("should correctly decrypt messages with the right key", () => {
    // Alice sends a message to Bob
    const originalMessage = "This is confidential information";
    const bobPublicKey = "bob-public-key";
    const encryptedContent = mockEncrypt(originalMessage, bobPublicKey);
    
    const sendResult = sendMessage(alice, bob, encryptedContent);
    const messageId = sendResult.ok;
    
    // Bob retrieves and decrypts the message
    const getResult = getMessage(messageId);
    const bobPrivateKey = "bob-private-key"; // In a real app, this would be securely stored
    const decryptedMessage = mockDecrypt(getResult.ok.encryptedContent, bobPrivateKey);
    
    expect(decryptedMessage).toBe(originalMessage);
  });

  it("should handle non-existent messages", () => {
    const nonExistentId = 999;
    const getResult = getMessage(nonExistentId);
    expect(getResult.err).toBe(1);
  });
});