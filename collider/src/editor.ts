import { EditorPlugin } from "@c3framework/core";
import Config from "./addon";

// * The commented code is for a potential rounded rectangle collider

// class RoundedRectangle {
//     left: number;
//     top: number;
//     right: number;
//     bottom: number;
//     width: number;
//     height: number;
//     angle: number;
//     radius: number;
//     points: number[];

//     constructor(rect: SDK.Rect, radius: number = 0, angle: number = 0) {
//         this.left = rect.getLeft();
//         this.top = rect.getTop();
//         this.right = rect.getRight();
//         this.bottom = rect.getBottom();
//         this.width = Math.abs(this.right - this.left);
//         this.height = Math.abs(this.bottom - this.top);
//         this.radius = Math.min(radius, this.width / 2, this.height / 2);
//         this.angle = angle;
//         this.points = this.generatePoints();
//     }

//     private generatePoints(): number[] {
//         const points: number[] = [];
//         const segments = 8; // Max 8 points per corner
//         const angleStep = Math.PI / 2 / segments;

//         const centerX = (this.left + this.right) / 2;
//         const centerY = (this.top + this.bottom) / 2;

//         const corners = [
//             { dx: this.width / 2 - this.radius, dy: -this.height / 2 + this.radius, startAngle: -Math.PI / 2 }, // TR
//             { dx: this.width / 2 - this.radius, dy: this.height / 2 - this.radius, startAngle: 0 }, // BR
//             { dx: -this.width / 2 + this.radius, dy: this.height / 2 - this.radius, startAngle: Math.PI / 2 }, // BL
//             { dx: -this.width / 2 + this.radius, dy: -this.height / 2 + this.radius, startAngle: Math.PI }, // TL
//         ];

//         for (const corner of corners) {
//             for (let i = 0; i <= segments; i++) {
//                 const angle = corner.startAngle + i * angleStep;
//                 const x = corner.dx + this.radius * Math.cos(angle);
//                 const y = corner.dy + this.radius * Math.sin(angle);
//                 points.push(...this.rotatePoint(x, y, centerX, centerY));
//             }
//         }

//         return points;
//     }

//     private rotatePoint(x: number, y: number, centerX: number, centerY: number): number[] {
//         const cosA = Math.cos(this.angle);
//         const sinA = Math.sin(this.angle);
//         return [
//             centerX + x * cosA - y * sinA,
//             centerY + x * sinA + y * cosA
//         ];
//     }

//     draw(iRenderer: SDK.Gfx.IWebGLRenderer): void {
//         iRenderer.ConvexPoly(this.points);
//     }
// }


class EditorInstance extends SDK.IWorldInstanceBase {
  constructor(sdkType: SDK.ITypeBase, inst: SDK.IWorldInstance) {
    super(sdkType, inst);
  }

  OnPlacedInLayout() {
    this._inst.SetSize(100, 100);
  }

  Draw(iRenderer: SDK.Gfx.IWebGLRenderer, iDrawParams: SDK.Gfx.IDrawParams) {
    // const rect = new SDK.Rect();
    // this._inst.GetQuad().getBoundingBox(rect);

    // const radius = this._inst.GetPropertyValue('radius');
    // const angle = this._inst.GetAngle();

    // const roundedRectangle = new RoundedRectangle(rect, radius * 100, angle);

    iRenderer.SetColorFillMode();
    iRenderer.SetColor(this._inst.GetColor());
    iRenderer.Quad(this._inst.GetQuad());
    // roundedRectangle.draw(iRenderer);
  }

  LoadC2Property(name: string, valueString: string) {
    return false;
  }
}

const A_C = SDK.Plugins[Config.id] = EditorPlugin.Base(Config);

A_C.Register(Config.id, A_C);

// @ts-expect-error
A_C.Type = EditorPlugin.Type(Config);

// @ts-expect-error
A_C.Instance = EditorInstance;
