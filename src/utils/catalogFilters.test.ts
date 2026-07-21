import { filterPlants, plantsByCategory } from "@/src/utils/catalogFilters";
import { plants } from "@/src/data/plants";
import { runPlantScan } from "@/src/services/scanPlant";
import { rankPlantMatches } from "@/src/services/plantMatch";
import { getRelatedPlants } from "@/src/utils/relatedPlants";

describe("catalog filters", () => {
  it("filters pet-friendly plants", () => {
    const result = filterPlants(plants, {
      light: "all",
      difficulty: "all",
      petFriendly: "yes",
    });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((plant) => plant.petFriendly)).toBe(true);
  });

  it("returns low-light category plants", () => {
    const result = plantsByCategory(plants, "lowLight");
    expect(result.every((plant) => plant.light === "low")).toBe(true);
  });
});

describe("scan and match services", () => {
  it("returns three ranked scan matches", () => {
    const matches = runPlantScan(42);
    expect(matches).toHaveLength(3);
    expect(matches[0].confidence).toBeGreaterThanOrEqual(matches[1].confidence);
  });

  it("ranks plant matches for a beginner pet home", () => {
    const ranked = rankPlantMatches(
      { light: "low", hasPets: true, experience: "beginner" },
      3,
    );
    expect(ranked).toHaveLength(3);
    expect(ranked[0].score).toBeGreaterThanOrEqual(ranked[1].score);
  });
});

describe("related plants", () => {
  it("excludes the source plant from recommendations", () => {
    const source = plants[0];
    const related = getRelatedPlants(source, 3);
    expect(related).toHaveLength(3);
    expect(related.every((plant) => plant.id !== source.id)).toBe(true);
  });
});
