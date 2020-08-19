import { Nullable } from "../../../../shared/types";

import { GraphNode, ICodeGenerationOutput, CodeGenerationOutputType, CodeGenerationExecutionType } from "../node";

export class Texture extends GraphNode<{ name: string; var_name: string; }> {
    /**
     * Defines the list of all avaialbe textures in the scene.
     */
    public static Textures: { name: string; base64: string; }[] = [];

    private _baseHeight: number;
    private _img: Nullable<HTMLImageElement> = null;
    private _lastTextureName: Nullable<string> = null;

    /**
     * Constructor.
     */
    public constructor() {
        super("Texture");

        this.addProperty("name", "None", "string");
        this.addProperty("var_name", "myTexture", "string");

        this.addWidget("combo", "name", this.properties.name, (v) => this.properties.name = v, {
            values: () => Texture.Textures.map((t) => t.name),
        });
        this.addWidget("text", "var_name", this.properties.var_name, (v) => this.properties.var_name = v);

        this.addOutput("Texture", "BaseTexture,Texture");

        this._baseHeight = this.size[1];
    }

    /**
     * Called on the node is being executed.
     */
    public execute(): void {
        const texture = this.getScene().textures.find((texture) => texture.metadata?.editorName === this.properties.name);
        this.setOutputData(0, texture ?? null);
    }

    /**
     * Generates the code of the graph.
     */
    public generateCode(): ICodeGenerationOutput {
        return {
            type: CodeGenerationOutputType.Variable,
            code: this.properties.var_name,
            executionType: CodeGenerationExecutionType.Properties,
            variable: {
                name: this.properties.var_name,
                value: `this._scene.textures.find((texture) => texture.metadata?.editorName === "${this.properties.name.replace("\\", "\\\\")}") as Texture`,
            },
            outputsCode: [
                { thisVariable: true },
            ],
            requires: [
                { module: "@babylonjs/core", classes: ["Texture"] }
            ]
        };
    }

    /**
     * Called each time the background is drawn.
     * @param ctx defines the rendering context of the canvas.
     * @override
     */
    public drawBackground(ctx: CanvasRenderingContext2D): void {
        super.drawBackground(ctx);

        const texture = Texture.Textures.find((texture) => texture.name === this.properties.name);
        if (!texture) {
            this.size[1] = this._baseHeight;
            return;
        }

        if (this.properties.name !== this._lastTextureName) {
            this._img = new Image();
            this._img.src = texture.base64;
        }

        if (this._img?.complete) {
            this.size[1] = this._baseHeight * 2 + 120;
            ctx.drawImage(this._img, 5, this._baseHeight + 5, this.size[0] - 10, this._baseHeight + 100);
        }
        
        this._lastTextureName = this.properties.name;
    }
}
