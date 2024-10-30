import React, { useEffect, useState } from "react";
import { fabric } from "fabric";

// Define the type for the LayersList props
interface LayersListProps {
  id: string;
  canvas: fabric.Canvas | null; // The canvas prop can be a Fabric.js Canvas instance or null
}

const LayersList: React.FC<LayersListProps> = ({ canvas }) => {
  const [layers, setLayers] = useState<fabric.Object[]>([]);

  // Function to update the layers list whenever the canvas changes
  const updateLayersList = () => {
    if (canvas) {
      const objects = canvas.getObjects();
      setLayers([...objects]); // Trigger re-render with updated layers
    }
  };

  // Listen for changes in the canvas using useEffect
  useEffect(() => {
    if (!canvas) return;

    // Update the layers list initially
    updateLayersList();

    // Add event listeners to canvas to detect changes
    canvas.on("object:added", updateLayersList);
    canvas.on("object:removed", updateLayersList);
    canvas.on("object:modified", updateLayersList);

    // Clean up listeners on component unmount
    return () => {
      canvas.off("object:added", updateLayersList);
      canvas.off("object:removed", updateLayersList);
      canvas.off("object:modified", updateLayersList);
    };
  }, [canvas]);

  // Forcefully re-render the component whenever the canvas changes
  useEffect(() => {
    updateLayersList();
  }, [canvas?.getObjects().length]); // Trigger whenever the objects' length changes

  return (
    <div className="layers-list absolute z-[50]">
      <h3>Layers List</h3>
      <ul>
        {layers
          .slice(1)
          .reverse()
          .map((layer, index) => (
            <li
              // key={layer?.id ? `${layer.id}-${index}` : index}
              style={{
                cursor: "pointer",
                backgroundColor:
                  layer === canvas?.getActiveObject() ? "#e6e6e6" : "#fff",
                padding: "5px",
                borderBottom: "1px solid #ddd",
              }}
              onClick={() => {
                if (canvas) {
                  canvas.setActiveObject(layer);
                  canvas.renderAll();
                }
              }}
            >
              Layer {index + 1}: {layer.type}{" "}
              {/* {layer.id ? `(ID: ${layer.id})` : ""} */}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default LayersList;
