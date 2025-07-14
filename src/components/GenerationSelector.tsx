import React from "react";
import { generations } from "../data/generations";

export function GenerationSelector({
  selectedGeneration,
  onGenerationSelected,
}: {
  selectedGeneration: number;
  onGenerationSelected: (generationIndex: number) => void;
}) {
  return (
    <select
      value={selectedGeneration}
      onChange={(e) => onGenerationSelected(parseInt(e.target.value, 10))}
    >
      {generations.map((gen, index) => (
        <option key={gen.name} value={index}>
          {gen.name}
        </option>
      ))}
    </select>
  );
}