export default class UserPlugin {
  constructor(path, name, description, image, onLoad) {
    this.path = path;
    this.name = name;
    this.description = description;
    this.image = image;
    this.onLoad = onLoad;
  }

  toSerializable() {
    return {
      path: this.path,
      name: this.name,
      description: this.description,
      image: this.image
    };
  }
}
