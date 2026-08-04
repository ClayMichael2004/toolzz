export const detectArchitecture = (scanResult) => {
  const folders = (scanResult.folders || []).map(f => f.toLowerCase());
  const fileTree = (scanResult.fileTree || []).map(f => f.toLowerCase());

  const hasFolder = (name) => folders.includes(name.toLowerCase());
  const hasTreeFolder = (name) => fileTree.some(p => p.includes(`/${name.toLowerCase()}/`) || p.startsWith(`${name.toLowerCase()}/`));

  const result = {
    architecture: "Modular Monolith",
    confidence: 80,
    reasons: []
  };

  // Monorepo
  if (
    hasFolder("packages") ||
    hasFolder("apps") ||
    fileTree.some(p => p.includes("pnpm-workspace.yaml") || p.includes("lerna.json") || p.includes("turbo.json"))
  ) {
    result.architecture = "Monorepo Workspace";
    result.confidence = 98;
    result.reasons.push("Detected workspace package manifests or apps/packages directories.");
    return result;
  }

  // Microservices
  if (hasFolder("services") && fileTree.some(p => p.includes("docker-compose"))) {
    result.architecture = "Microservices Architecture";
    result.confidence = 92;
    result.reasons.push("Detected multi-service directory structure with Docker orchestration.");
    return result;
  }

  // Clean Architecture
  if (
    (hasFolder("domain") || hasTreeFolder("domain")) &&
    (hasFolder("infrastructure") || hasTreeFolder("infrastructure"))
  ) {
    result.architecture = "Clean / Hexagonal Architecture";
    result.confidence = 96;
    result.reasons.push("Detected domain, infrastructure, and application layer boundaries.");
    return result;
  }

  // Feature-Based
  if (hasFolder("features") || hasFolder("modules")) {
    result.architecture = "Feature-Based Modular";
    result.confidence = 94;
    result.reasons.push("Organized by feature slices or module domains.");
    return result;
  }

  // MVC / Layered Architecture
  if (
    (hasFolder("controllers") || hasTreeFolder("controllers")) &&
    (hasFolder("routes") || hasTreeFolder("routes") || hasFolder("api"))
  ) {
    result.architecture = "Layered MVC Architecture";
    result.confidence = 95;
    result.reasons.push("Controller, routing, and data service layer separation detected.");
    if (hasFolder("services") || hasTreeFolder("services")) {
      result.reasons.push("Decoupled service business logic layer present.");
    }
    return result;
  }

  // Component-Based Frontend
  if (hasFolder("components") && (hasFolder("pages") || hasFolder("views") || hasFolder("app"))) {
    result.architecture = "Component-Based UI Architecture";
    result.confidence = 92;
    result.reasons.push("React/Vue UI component layout with file-system or routing views.");
    return result;
  }

  result.reasons.push("Standard project folder layout.");
  return result;
};