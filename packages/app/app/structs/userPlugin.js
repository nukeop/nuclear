export default class UserPlugin {
  constructor(path, name, description, image, author, onLoad) {
    this.path = path;
    this.name = name;
    this.description = description;
    this.image = image;
    this.author = author;
    this.onLoad = onLoad;
  }

  toSerializable() {
    return {
      path: this.path,
      name: this.name,
      description: this.description,
      author: this.author,
      image: this.image
    };
  }
}
