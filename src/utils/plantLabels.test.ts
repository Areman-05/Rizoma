import { difficultyLabel, experienceLabel, lightLabel, wateringLabel } from "@/src/utils/plantLabels";

describe("plantLabels", () => {
  it("maps light levels to Spanish", () => {
    expect(lightLabel("low")).toBe("Luz baja");
    expect(lightLabel("medium")).toBe("Luz media");
    expect(lightLabel("high")).toBe("Luz alta");
  });

  it("maps watering cadence to Spanish", () => {
    expect(wateringLabel("weekly")).toBe("Riego semanal");
    expect(wateringLabel("2x week")).toBe("Riego 2x semana");
  });

  it("maps difficulty and experience", () => {
    expect(difficultyLabel("easy")).toBe("Facil");
    expect(experienceLabel("beginner")).toBe("Principiante");
  });
});
