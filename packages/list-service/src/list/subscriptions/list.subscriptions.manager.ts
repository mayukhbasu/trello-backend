import { Injectable } from "@nestjs/common";

@Injectable()
export class ListSubscriptionsManager {
  private readonly subscriptions: Map<string, Set<string>> = new Map();
  addSubscription(boardId: string, clientId: string): void {
    if (!this.subscriptions.has(boardId)) {
      this.subscriptions.set(boardId, new Set());
    }
    this.subscriptions.get(boardId)?.add(clientId);
  }

  removeSubscription(boardId: string, clientId: string): void {
    const subscribers = this.subscriptions.get(boardId);
    if (subscribers) {
      subscribers.delete(clientId); // Remove the client
      if (subscribers.size === 0) {
        this.subscriptions.delete(boardId); // Clean up if no clients remain
      }
    }
  }

  getSubscribers(boardId: string): string[] {
    return Array.from(this.subscriptions.get(boardId) || []);
  }
}