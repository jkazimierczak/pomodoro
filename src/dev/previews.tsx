import React from "react";
import {ComponentPreview, Previews} from "@react-buddy/ide-toolbox";
import {PaletteTree} from "./palette";
import {Circle} from "@/features/Timer/Circle";
import App from "@/App";
import {Timer} from "@/features/Timer";

const ComponentPreviews = () => {
  return (
    <Previews palette={<PaletteTree />}>
      <ComponentPreview path="/Circle">
        <Circle />
      </ComponentPreview>
      <ComponentPreview path="/App">
        <App />
      </ComponentPreview>
      <ComponentPreview path="/Timer">
        <Timer />
      </ComponentPreview>
    </Previews>
  );
};

export default ComponentPreviews;