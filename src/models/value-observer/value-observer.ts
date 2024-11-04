export class ValueObserver<T> {
  private _value: T;
  private observers: Set<(value: T) => void> = new Set();

  set value(value: T) {
    if (value !== this._value) {
      this._value = value;
      this.observers.forEach(callback => callback(this._value))
    }
  }

  get value(): T {
    return this._value;
  }

  constructor(value: T) {
    this._value = value;
  }

  subscribe(subscriber: (value: T) => void) {
    this.observers.add(subscriber);

    return () => {
      this.unsubscribe(subscriber);
    }
  }

  unsubscribe(subscriber: (value: T) => void) {
    this.observers.delete(subscriber);
  }

  toString(): string {
    return this._value?.toString() ?? typeof this._value;
  }

  removeSubscribers() {
    this.observers.clear()
  }
}
