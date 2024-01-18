import { Deserializable } from "./deserializable.model";

export class User implements Deserializable {
  id: string;
  name: string;
  username: string;
  password: string;
  token: string;

  constructor(
    id: string,
    name: string,
    username: string,
    password: string,
    token: string
  ) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.password = password;
    this.token = token;
  }

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }

  getName(): string {
    return `${this.name}`;
  }

  getUsername(): string {
    return `${this.username}`;
  }
}
