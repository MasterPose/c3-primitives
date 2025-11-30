import { EditorPlugin } from "@c3framework/core";
import Config from "./addon";

function getConvexPolygonPoints(rect: SDK.Rect): number[] {
  const points: number[] = [];
  const left = rect.getLeft();
  const top = rect.getTop();
  const right = rect.getRight();
  const bottom = rect.getBottom();

  const centerX = (left + right) / 2;
  const centerY = (top + bottom) / 2;
  const radiusX = (right - left) / 2;
  const radiusY = (bottom - top) / 2;
  const radius = Math.min(radiusX, radiusY);

  const numPoints = Math.max(16, Math.min(64, Math.floor(radius)));
  const angleStep = (2 * Math.PI) / numPoints;

  for (let i = 0; i < numPoints; i++) {
    const angle = i * angleStep;
    points.push(centerX + radiusX * Math.cos(angle)); // X coordinate
    points.push(centerY + radiusY * Math.sin(angle)); // Y coordinate
  }

  return points;
}

function modifyQuad(
  quad: SDK.Quad,
  yOffset: number,
  newWidth: number,
  newHeight: number,
): SDK.Quad {
  const centerX =
    (quad.getTlx() + quad.getTrx() + quad.getBrx() + quad.getBlx()) / 4;
  const centerY =
    (quad.getTly() + quad.getTry() + quad.getBry() + quad.getBly()) / 4;

  const halfNewWidth = newWidth / 2;
  const halfNewHeight = newHeight / 2;

  const modifiedQuad = new SDK.Quad(
    centerX - halfNewWidth,
    centerY - halfNewHeight + yOffset,
    centerX + halfNewWidth,
    centerY - halfNewHeight + yOffset,
    centerX + halfNewWidth,
    centerY + halfNewHeight + yOffset,
    centerX - halfNewWidth,
    centerY + halfNewHeight + yOffset,
  );

  return modifiedQuad;
}

function getQuadSize(quad: SDK.Quad): { width: number; height: number } {
  const width = Math.max(quad.getTrx(), quad.getBrx()) -
    Math.min(quad.getTlx(), quad.getBlx());
  const height = Math.max(quad.getBry(), quad.getBly()) -
    Math.min(quad.getTly(), quad.getTry());

  return { width, height };
}

const tempRect = new SDK.Rect();
const tempQuad = new SDK.Quad();

class EditorInstance extends SDK.IWorldInstanceBase {
  _webglText?: SDK.Gfx.IWebGLText;

  constructor(sdkType: SDK.ITypeBase, inst: SDK.IWorldInstance) {
    super(sdkType, inst);
  }

  OnPlacedInLayout() {
    const radius = this.GetRadius();
    this._inst.SetSize(radius, radius);
  }

  GetRadius() {
    return this._inst.GetPropertyValue("radius") as number | undefined ?? 16;
  }

  GetLabel() {
    return this._inst.GetPropertyValue("label") as string | undefined ?? "";
  }

  Release() {
    // Release the WebGL text if it was created
    if (this._webglText) {
      this._webglText.Release();
      this._webglText = undefined;
    }
  }

  OnPropertyChanged(id: string, value: EditorPropertyValueType): void {
    if (id === "radius") {
      const size = value as number;
      this._inst.SetSize(size, size);
    }
  }

  Draw(iRenderer: SDK.Gfx.IWebGLRenderer, iDrawParams: SDK.Gfx.IDrawParams) {
    iRenderer.SetColorFillMode();
    iRenderer.SetColor(this._inst.GetColor());
    iRenderer.ConvexPoly(
      getConvexPolygonPoints(this._inst.GetBoundingBox()),
    );

    const label = this.GetLabel();

    if (!label) return;

    const iLayoutView = iDrawParams.GetLayoutView();

    this._MaybeCreateWebGLText(iRenderer, iLayoutView);

    const text = this._webglText;

    if (!text) return;

    const radius = this.GetRadius();

    text.SetText(label);
    text.SetFontSize(Math.min(Math.max(radius / 4, 4), 16));
    text.SetColor(this._inst.GetColor());

    this._DrawText(iRenderer, iLayoutView, text);
  }

  _DrawText(
    iRenderer: SDK.Gfx.IWebGLRenderer,
    iLayoutView: SDK.UI.ILayoutView,
    text: SDK.Gfx.IWebGLText,
  ) {
    const texture = text.GetTexture();

    const quad = modifyQuad(
      this._inst.GetQuad(),
      (this.GetRadius() + 100) / 2,
      Math.max(50, this.GetRadius() * 2),
      100,
    );

    const textZoom = iLayoutView.GetZoomFactor();
    const { width, height } = getQuadSize(quad);

    text.SetSize(width, height, textZoom);

    if (!texture) return;

    iRenderer.SetTextureFillMode();

    if (this._inst.GetAngle() === 0) {
      // The quad is unrotated, so we can convert it back to a rect using its top-left and bottom-right points.
      // Translate in to render surface co-ords and align it to the nearest pixel.
      const dl = iLayoutView.LayoutToClientDeviceX(quad.getTlx());
      const dt = iLayoutView.LayoutToClientDeviceY(quad.getTry());
      const dr = iLayoutView.LayoutToClientDeviceX(quad.getBrx());
      const db = iLayoutView.LayoutToClientDeviceY(quad.getBry());
      const offX = dl - Math.round(dl);
      const offY = dt - Math.round(dt);
      tempRect.set(dl, dt, dr, db);
      tempRect.offset(-offX, -offY);
      tempQuad.setFromRect(tempRect);

      iLayoutView.SetDeviceTransform(iRenderer);

      iRenderer.SetTexture(texture);
      iRenderer.SetColor(this._inst.GetColor());
      iRenderer.Quad3(tempQuad, text.GetTexRect());

      iLayoutView.SetDefaultTransform(iRenderer);
    } else {
      iRenderer.SetTexture(texture);
      iRenderer.SetColor(this._inst.GetColor());
      iRenderer.Quad3(quad, text.GetTexRect());
    }
  }

  _MaybeCreateWebGLText(
    iRenderer: SDK.Gfx.IWebGLRenderer,
    iLayoutView: SDK.UI.ILayoutView,
  ) {
    if (this._webglText) return;

    const text = iRenderer.CreateRendererText();

    text.SetWordWrapMode("character");
    text.SetLineHeight(0);
    text.SetHorizontalAlignment("center");
    text.SetVerticalAlignment("top");

    text.SetTextureUpdateCallback(() => iLayoutView.Refresh());

    this._webglText = text;
  }

  IsOriginalSizeKnown(): boolean {
    return false;
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
