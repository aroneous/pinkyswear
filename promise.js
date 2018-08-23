// My own implementation of Promises, as an exercise

class Prom {
  constructor(resolver) {
    this._settled = false;
    this._listeners = [];

    if (resolver) {
      resolver(res => this._resolveSuccess(res), err => this._resolveError(err));
    }
  }

  then(success, err) {
    const l = new Prom();
    l._successAction = success;
    l._errAction = err;
    this._listeners.push(l);
    if (this._settled) {
      setTimeout(() => this._processResolution(l));
    }
    return l;
  }

  catch(err) {
    return this.then(undefined, err);
  }

  /**
   * Process resolution of this promise for the specified chained promise
   */
  _processResolution(chainedPromise) {
    chainedPromise._trigger(this._succeeded, this._result)
  }

  /**
   * Trigger this Promise
   */
  _trigger(success, value) {
    var result;
    var nextSuccess = true;
    if (success) {
      if (this._successAction) {
        result = this._successAction(value);
      } else {
        result = value;
      }
    } else {
      if (this._errAction) {
        result = this._errAction(value);
      } else {
        result = value;
        nextSuccess = false;
      }
    }

    if (result && typeof(result.then) === 'function') {
      // Result of action is a thenable - We have to wait on this promise
      result.then(val => this._settle(true, val), err => this._settle(false, err));
    } else {
      // Synchronous value - settle using it
      this._settle(nextSuccess, result);
    }
  }

  /**
   * Settle this promise
   */
  _settle(success, value) {
    setTimeout(() => {
      this._settled = true;
      this._succeeded = success;
      this._result = value;
      for (const listener of this._listeners) {
        this._processResolution(listener);
      }
    });
  }

  _resolveSuccess(arg) {
    this._settle(true, arg);
  }

  _resolveError(err) {
    this._settle(false, err);
  }
}

module.exports = Prom;
