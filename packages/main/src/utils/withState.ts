class WithState<T = any> {
  constructor(protected state: T) {}

  protected setState(update: Partial<T>) {
    this.state = {
      ...this.state,
      ...update,
    }

    this.render();
  }

  render() {}
}

export default WithState;
