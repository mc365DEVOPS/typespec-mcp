import { type Children, List, type Refkey, SourceDirectory, type SymbolCreator } from "@alloy-js/core";
import { SourceFile } from "@alloy-js/typescript";
import type { Program } from "@typespec/compiler";
import { Output } from "@typespec/emitter-framework";
import { zod } from "typespec-zod";
import { createMCPServerContext, MCPServerContext } from "../context/McpServer.js";
import { mcpSdk } from "../externals/mcp-sdk.js";
import { zodValidationError } from "../externals/zod-validation-error.js";
import { zodToJsonSchema } from "../externals/zodToJsonSchema.js";
import { CallToolHandlers } from "./CallToolHandlers.jsx";
import { ListToolsHandler } from "./ListToolsHandler.jsx";
import { ServerDeclaration } from "./ServerDeclaration.jsx";
import { ToolHandlerAccessors } from "./ToolHandlerAccessors.jsx";
import { ToolsInterface } from "./ToolsInterface.jsx";
import { TsTypes } from "./TsTypes.jsx";
import { ZodTypes } from "./ZodTypes.jsx";
import { JsonSchemas } from "./json-schemas.jsx";

export interface McpServerProps {
  program: Program;
  externals?: SymbolCreator[];
  toolImplementation?: {
    dispatcher: Refkey;
    implementation: Children;
  };
}
export function McpServer(props: McpServerProps) {
  const mcpServerContext: MCPServerContext = createMCPServerContext(props.program, {
    toolDispatcher: props.toolImplementation?.dispatcher,
  });

  const libs = [...Libs, ...(props.externals ?? [])];

  return (
    <Output program={props.program} externals={libs} namePolicy={mcpServerContext.namePolicy}>
      <MCPServerContext.Provider value={mcpServerContext}>
        <SourceDirectory path="schemas">
          <SourceFile path="zod.ts">
            <ZodTypes />
          </SourceFile>
          <SourceFile path="json-schemas.ts">
            <JsonSchemas />
          </SourceFile>
        </SourceDirectory>
        <SourceFile path="ts-types.ts">
          <TsTypes />
        </SourceFile>
        <SourceFile path="index.ts">
          <List doubleHardline>
            <ServerDeclaration />
            <ListToolsHandler />
            <CallToolHandlers />
            {props.toolImplementation?.implementation}
          </List>
        </SourceFile>
        <SourceFile path="tools.ts">
          <List doubleHardline>
            <ToolsInterface />
            <ToolHandlerAccessors />
          </List>
        </SourceFile>
      </MCPServerContext.Provider>
    </Output>
  );
}

export const Libs = [mcpSdk, zod, zodToJsonSchema, zodValidationError];
