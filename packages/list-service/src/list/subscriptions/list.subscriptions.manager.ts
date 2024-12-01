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
    this.subscriptions.get(boardId)?.delete(clientId);
    if (this.subscriptions.get(boardId)?.size === 0) {
      this.subscriptions.delete(boardId);
    }
  }

  getSubscribers(boardId: string): string[] {
    return Array.from(this.subscriptions.get(boardId) || []);
  }
}