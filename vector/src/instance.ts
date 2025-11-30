import { AceClass, Action, Condition, Expression, Param, Plugin } from "@c3framework/core";
import Config from "./addon";

@AceClass()
class Instance
  extends Plugin.Instance(Config, globalThis.ISDKWorldInstanceBase) {
  constructor() {
    super();

    this._updateAngle();
  }

  @Action({
    listName: "Set angle from components",
    description:
      "Manually sets the angle of the Vector by their components. This is automatically called when doing any Vector operation.",
    category: "angle",
  })
  angleFromComponents(): void {
    this._updateAngle();
  }

  @Action({
    listName: "Set components",
    description: "Sets the vector X and Y, and ensures to update the angle.",
    category: "size-position",
    highlight: true,
  })
  setComponents(
    @Param({ desc: "The X component" }) x: number = 0,
    @Param({ desc: "The Y component" }) y: number = 0,
  ): void {
    this.x = x;
    this.y = y;
    this._updateAngle();
  }

  @Action({
    listName: "Vector Zero",
    description: "Converts to zero vector (0, 0).",
    category: "conversion",
  })
  toZero(): void {
    this.x = 0;
    this.y = 0;
    this._updateAngle();
  }

  @Action({
    listName: "Vector One",
    description: "Converts to unit vector (1, 1).",
    category: "conversion",
  })
  toOne(): void {
    this.x = 1;
    this.y = 1;
    this._updateAngle();
  }

  @Action({
    listName: "Vector Left",
    description: "Converts to left vector (-1, 0).",
    category: "conversion",
  })
  toLeft(): void {
    this.x = -1;
    this.y = 0;
    this._updateAngle();
  }

  @Action({
    listName: "Vector Right",
    description: "Converts to right vector (1, 0).",
    category: "conversion",
  })
  toRight(): void {
    this.x = 1;
    this.y = 0;
    this._updateAngle();
  }

  @Action({
    listName: "Vector Up",
    description: "Converts to up vector (0, 1).",
    category: "conversion",
  })
  toUp(): void {
    this.x = 0;
    this.y = -1;
    this._updateAngle();
  }

  @Action({
    listName: "Vector Down",
    description: "Converts to down vector (0, -1).",
    category: "conversion",
  })
  toDown(): void {
    this.x = 0;
    this.y = 1;
    this._updateAngle();
  }

  @Action({
    listName: "Vector Fixed",
    description: "Rounds the vector to a fixed number of decimal places.",
    category: "conversion",
  })
  toFixed(precision: number): void {
    this.x = parseFloat(this.x.toFixed(precision));
    this.y = parseFloat(this.y.toFixed(precision));
    this._updateAngle();
  }

  @Action({
    listName: "Add",
    description: "Adds x and y components to the vector.",
    category: "calculation",
  })
  add(
    @Param({ desc: "The X component" }) x: number = 0,
    @Param({ desc: "The Y component" }) y: number = 0,
  ): void {
    this.x += x;
    this.y += y;
    this._updateAngle();
  }

  @Action({
    listName: "Subtract",
    description: "Subtracts x and y components from the vector.",
    category: "calculation",
  })
  sub(
    @Param({ desc: "The X component" }) x: number = 0,
    @Param({ desc: "The Y component" }) y: number = 0,
  ): void {
    this.x -= x;
    this.y -= y;
    this._updateAngle();
  }

  @Action({
    listName: "Scale",
    description: "Scales the vector by x and y factors.",
    category: "calculation",
  })
  scale(x: number = 1, y: number = 1): void {
    this.x *= x;
    this.y *= y;
    this._updateAngle();
  }

  @Action({
    listName: "Max",
    description:
      "Sets the vector components to the maximum of the vector and the input values (x, y).",
    category: "calculation",
  })
  max(
    @Param({ desc: "The X component" }) x: number = 0,
    @Param({ desc: "The Y component" }) y: number = 0,
  ): void {
    this.x = Math.max(this.x, x);
    this.y = Math.max(this.y, y);
    this._updateAngle();
  }

  @Action({
    listName: "Min",
    description:
      "Sets the vector components to the minimum of the vector and the input values (x, y).",
    category: "calculation",
  })
  min(
    @Param({ desc: "The X component" }) x: number = 0,
    @Param({ desc: "The Y component" }) y: number = 0,
  ): void {
    this.x = Math.min(this.x, x);
    this.y = Math.min(this.y, y);
    this._updateAngle();
  }

  @Action({
    listName: "Clamp",
    description:
      "Clamps the vector components between the given min and max values",
    category: "calculation",
  })
  clamp(
    @Param({ desc: "The minimum X component" }) minX: number,
    @Param({ desc: "The minimum Y component" }) minY: number,
    @Param({ desc: "The maximum X component" }) maxX: number,
    @Param({ desc: "The maximum Y component" }) maxY: number,
  ): void {
    this.x = Math.max(minX, Math.min(this.x, maxX));
    this.y = Math.max(minY, Math.min(this.y, maxY));
    this._updateAngle();
  }

  @Expression({
    description:
      "Returns the Euclidean distance from the vector to another point.",
    category: "calculation",
  })
  dist(
    @Param({ desc: "The X component" }) x: number = 0,
    @Param({ desc: "The Y component" }) y: number = 0,
  ): number {
    return Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2));
  }

  @Expression({
    description:
      "Returns the squared Euclidean distance from the vector to another point.",
    category: "calculation",
  })
  sdist(
    @Param({ desc: "The X component" }) x: number = 0,
    @Param({ desc: "The Y component" }) y: number = 0,
  ): number {
    return Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2);
  }

  @Expression({
    description: "Returns the length (magnitude) of the vector.",
    category: "calculation",
  })
  len(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  @Action({
    listName: "Normalize",
    description: "Normalizes the vector.",
    category: "conversion",
  })
  normal(): void {
    const length = this.len();

    if (length !== 0) {
      this.x /= length;
      this.y /= length;
    } else {
      this.x = 0;
      this.y = 0;
    }

    this._updateAngle();
  }

  @Action({
    listName: "Reflect",
    description: "Get the reflection of a vector with a normal.",
    category: "calculation",
  })
  reflect(
    @Param({ desc: "The X component" }) x: number = 0,
    @Param({ desc: "The Y component" }) y: number = 0,
  ): void {
    const dotProd = this.dot(x, y);
    this.x -= 2 * dotProd * x;
    this.y -= 2 * dotProd * y;
    this._updateAngle();
  }

  @Action({
    listName: "Project",
    description: "Projects the vector onto another vector (x, y).",
    category: "calculation",
  })
  project(
    @Param({ desc: "The X component" }) x: number = 0,
    @Param({ desc: "The Y component" }) y: number = 0,
  ): void {
    const dotProd = this.dot(x, y);
    const len = Math.sqrt(x * x + y * y);

    const scalar = dotProd / len;

    this.x = scalar * x;
    this.y = scalar * y;

    this._updateAngle();
  }

  @Action({
    listName: "Reject",
    description:
      "Rejects the vector onto a perpendicular direction from another vector (x, y).",
    category: "calculation",
  })
  reject(
    @Param({ desc: "The X component" }) x: number = 0,
    @Param({ desc: "The Y component" }) y: number = 0,
  ): void {
    const dotProd = this.dot(x, y);
    const len = Math.sqrt(x * x + y * y);

    const scalar = dotProd / len;

    this.x -= scalar * x;
    this.y -= scalar * y;

    this._updateAngle();
  }

  @Expression({
    description: "Calculates the aspect ratio of the vector.",
    category: "calculation",
  })
  aspect(): number {
    return this.x / this.y;
  }

  @Expression({
    description:
      "Returns the dot product of the vector and another vector (x, y).",
    category: "calculation",
  })
  dot(
    @Param({ desc: "The X component" }) x: number = 0,
    @Param({ desc: "The Y component" }) y: number = 0,
  ): number {
    return this.x * x + this.y * y;
  }

  @Expression({
    description:
      "Returns the cross product of the vector and another vector (x, y).",
    category: "calculation",
  })
  cross(
    @Param({ desc: "The X component" }) x: number = 0,
    @Param({ desc: "The Y component" }) y: number = 0,
  ): number {
    return this.x * y - this.y * x;
  }

  @Action({
    description:
      "Sets each component to 1.0 if it's positive, -1.0 if it's negative and 0.0 if it's zero.",
    category: "conversion",
  })
  sign() {
    this.x = Math.sign(this.x);
    this.y = Math.sign(this.y);
    this._updateAngle();
  }

  @Action({
    listName: "Snap",
    description:
      "Snaps each component to the nearest multiple of the corresponding step",
    category: "calculation",
  })
  snapped(
    @Param({ desc: "The step X component" }) stepX: number = 1,
    @Param({ desc: "The step Y component" }) stepY: number = 1,
  ) {
    this.x = Math.round(this.x / stepX) * stepX;
    this.y = Math.round(this.y / stepY) * stepY;
    this._updateAngle();
  }

  @Condition({
    description: "Checks if each component is zero.",
  })
  isZero(): boolean {
    return this.x === 0 && this.y === 0;
  }

  @Condition({
    description:
      "Checks if the vector is normalized, i.e. its length is approximately equal to 1.",
  })
  isNormalized(): boolean {
    return Math.abs(this.len() - 1) < Number.EPSILON;
  }

  @Condition({
    description: "Checks if each component is a finite number.",
  })
  isFinite(): boolean {
    return isFinite(this.x) && isFinite(this.y);
  }

  // Construct thing, idk
  IsOriginalSizeKnown(): boolean {
    return false;
  }

  _debugProperties(): KeyValue {
    return {};
  }

  _updateAngle(): void {
    this.angle = Math.atan2(this.y, this.x);
  }
}

export default Instance;
