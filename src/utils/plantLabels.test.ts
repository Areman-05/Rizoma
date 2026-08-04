import { difficultyLabel, experienceLabel, lightLabel, wateringIntervalDays, wateringLabel } from "@/src/utils/plantLabels";

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

  it("maps watering cadence to interval days", () => {
    expect(wateringIntervalDays("2x week")).toBe(3);
    expect(wateringIntervalDays("weekly")).toBe(7);
    expect(wateringIntervalDays("biweekly")).toBe(14);
    expect(wateringIntervalDays("monthly")).toBe(30);
  });

  it("maps difficulty and experience", () => {
    expect(difficultyLabel("easy")).toBe("Fácil");
    expect(experienceLabel("beginner")).toBe("Principiante");
  });
});
